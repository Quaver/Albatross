import * as _ from "lodash";
import User from "../sessions/User";
import MultiplayerGame from "./MultiplayerGame";
import IUniqueIdtoGameMap from "./maps/IUniqueIdToGameMap";
import Logger from "../logging/Logger";
import Albatross from "../Albatross";
import ServerPacketMultiplayerGameInfo from "../packets/server/ServerPacketMultiplayerGameInfo";
import ServerPacketGameDisbanded from "../packets/server/ServerPacketGameDisbanded";
import MultiplayerGameType from "./MultiplayerGameType";
import Bot from "../bot/Bot";
import MultiplayerGameRuleset from "./MultiplayerGameRuleset";
import GameMode from "../enums/GameMode";
import DiscordWebhookHelper from "../discord/DiscordWebhookHelper";
import * as Discord from "discord.js";
import ChatManager from "../chat/ChatManager";
import ChatChannel from "../chat/ChatChannel";
import UserGroups from "../enums/UserGroups";
import RedisHelper from "../database/RedisHelper";

export default class Lobby {
    /**
     * The list of users that are currently in the lobby
     */
    public static Users: User[] = [];

    /**
     * The currently active multiplayer games.
     */
    public static Games: IUniqueIdtoGameMap = {};

    /**
     * Used strictly as a test game that can be joined.
     */
    public static InitializeTest(): void {
        var game = MultiplayerGame.Create(MultiplayerGameType.Friendly, "Test Game", "testing123", 16, "None", 2, 2, "Artist - Title [Diff]", 
        MultiplayerGameRuleset.Free_For_All, false, GameMode.Keys4, 50.24);
        
        Bot.User.JoinMultiplayerGame(game, "testing123");
        game.ChangeHost(Bot.User);
        Lobby.CreateGame(game);
    }

    /**
     * Adds a user to the multiplayer lobby
     */
    public static AddUser(user: User): void {
        if (Lobby.Users.includes(user))
            return;

        Lobby.Users.push(user);

        for (let i in Lobby.Games)
            Albatross.SendToUser(user, new ServerPacketMultiplayerGameInfo(Lobby.Games[i]));
    }

    /**
     * Removes a user from the multiplayer lobby.
     * @param user 
     */
    public static RemoveUser(user: User): void {
        _.remove(Lobby.Users, user);
    }

    /**
     * Creates a new multiplayer match
     */
    public static async CreateGame(game: MultiplayerGame): Promise<void> {
        Lobby.Games[game.Id] = game;

        // Create a new chat channel for the multiplayer game.
        const channelName: string = `#multiplayer_${game.Id}`; 
        const chan: ChatChannel = new ChatChannel(channelName, "Multiplayer Game Chat Discussion", UserGroups.Normal, false, false, 
                                                    DiscordWebhookHelper.MultiplayerMessageHook);

        ChatManager.Channels[channelName] = chan;

        // Create team chat channel
        const teamChan: ChatChannel = new ChatChannel(game.GetTeamChatChannelName(), "Multiplayer Team Chat", UserGroups.Normal, false, false,
            DiscordWebhookHelper.MultiplayerMessageHook);

        ChatManager.Channels[game.GetTeamChatChannelName()] = teamChan;

        await game.InsertGameIntoDatabase();
        await RedisHelper.incr("quaver:server:multiplayer_matches");
        await game.CacheMatchSettings();

        Albatross.SendToUsers(Lobby.Users, new ServerPacketMultiplayerGameInfo(game));
        Logger.Success(`Multiplayer Game: "${game.Name}" <${game.Id}> has been created.`);
    }

    /**
     * Disbands a multiplayer game
     * @param game 
     */
    public static async DeleteGame(game: MultiplayerGame): Promise<void> {
        await game.StopMatchCountdown();
        delete Lobby.Games[game.Id];

        // Removes the multiplayer chat channel.
        const channelName: string = `#multiplayer_${game.Id}`; 
        delete ChatManager.Channels[channelName];
        delete ChatManager.Channels[game.GetTeamChatChannelName()];

        Albatross.SendToUsers(Lobby.Users, new ServerPacketGameDisbanded(game));
        Logger.Success(`Multiplayer Game: "${game.Name}" <${game.Id}> has been disbanded.`);

        await RedisHelper.decr("quaver:server:multiplayer_matches");
        await game.DeleteCachedMatchScores();
        await game.DeleteCachedMatchSettings();
    }
}