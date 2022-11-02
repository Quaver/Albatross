import * as _ from "lodash";
import User from "../handlers/rooster/User";
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
import SqlDatabase from "../database/SqlDatabase";
import { Multi } from "redis";
import GameModeHelper from "../utils/GameModeHelper";
import MultiplayerAutoHost from "./MultiplayerAutoHost";
import MultiplayerFreeModType from "./MultiplayerFreeModType";
import ServerPacketAllPlayersLoaded from "../packets/server/ServerPacketAllPlayersLoaded";
const config = require("../config/config.json");

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
    public static async Initialize(): Promise<void> {
        await Lobby.CreateAutohostGames();
    }

    /**
     * Adds a user to the multiplayer lobby
     */
    public static AddUser(user: User): void {
        if (Lobby.Users.includes(user))
            return;

        Lobby.Users.push(user);

        for (let i in Lobby.Games) {
            const game = Lobby.Games[i];
            Albatross.SendToUser(user, new ServerPacketMultiplayerGameInfo(game));
        }
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

        await RedisHelper.del("quaver:server:multiplayer_matches");
        await game.DeleteCachedMatchScores();
        await game.DeleteCachedMatchSettings();
    }

    /**
     * Deletes empty multiplayer games
     */
    public static async DeleteEmptyGames(): Promise<void> {
        const gamesToDelete: any[] = [];
        
        for (let i in Lobby.Games) {
            const game = Lobby.Games[i];

            if (!game.TournamentMode && game.PlayerIds.length == 0) {
                // End auto-host games if it got stuck
                if (game.IsAutohost) {
                    if (game.InProgress) {
                        Logger.Info(`Ending stuck AutoHost game: ${game.GameId}`);
                        await game.End();
                        continue;
                    }
                } else {
                    Logger.Info(`Removing zero-player multiplayer game: ${Lobby.Games[i].GameId}`);
                    gamesToDelete.push(Lobby.Games[i]);
                }
            }
        }

        for (let i = 0; i < gamesToDelete.length; i++)
            await Lobby.DeleteGame(gamesToDelete[i]);
    }

    /**
     * Creates games that are autohosted by the server
     */
    public static async CreateAutohostGames(): Promise<void> {
        try {
            for (let i = 0; i < 2; i++) {
                for (let j = 0; j < 40; j += 5) {
                    const mode = i + 1;
                    const modeStr = `${GameModeHelper.GetShortStringFromMode(mode)}`;
                    const minDiff = j;
                    const maxDiff = j + 5;
                    const name = `${modeStr} AutoHost Game | Difficulty: ${minDiff} - ${maxDiff}`;
 
                    const game = MultiplayerGame.Create(MultiplayerGameType.Friendly, name, null, 16, "md5", -1, -1, "map name", 
                        MultiplayerGameRuleset.Free_For_All, false, i, 0, [], 0, "md5", Bot.User);

                    game.IsAutohost = true;
                    game.AutoHost = new MultiplayerAutoHost(game, mode, minDiff, maxDiff);

                    await game.SetFreeModType(MultiplayerFreeModType.Regular);
                    await game.ChangeMinimumDifficulty(minDiff);
                    await game.ChangeMaximumDifficulty(maxDiff);
                    await game.AutoHost.SelectMap();
                    await Lobby.CreateGame(game);
                }
            }
        } catch (err) {
            Logger.Error(err);
        }
    }

    /**
     * Automatically start auto-host matches
     */
    public static async StartAutoHostMatches(): Promise<void> {
        try { 
            for (let i in Lobby.Games) {
                const game = Lobby.Games[i];

                if (!game.IsAutohost || game.InProgress || game.Players.length == 0 || game.CountdownStartTime != -1)
                    continue;

                // Don't start if there's only one person in the lobby and they don't have the map.
                if (game.PlayerIds.length == 1 && game.PlayersWithoutMap.length == 1)
                    continue;

                await game.StartMatchCountdown(90000);
                Logger.Info(`Starting AutoHost game countdown: ${game.Name}`);
            }
        } catch (err) {
            Logger.Error(err);
        }
    }

     /**
     * Automatically start auto-host matches
     */
    public static async FixStuckMultiplayerGames(): Promise<void> {
        try { 
            for (let i in Lobby.Games) {
                const game = Lobby.Games[i];

                // Remove any ghost users from game
                for (let j = game.Players.length - 1; j >= 0; j--) {
                    const player = game.Players[j];

                    if (!Albatross.Instance.OnlineUsers.GetUserById(player.Id))
                        await player.DisconnectUserSession();
                }

                if (!game.InProgress || game.AllPlayersLoaded)
                    continue;

                if (game.PlayersGameStartedWith.length != game.PlayersWithGameScreenLoaded.length)
                    continue;

                game.AllPlayersLoaded = true;
                Albatross.SendToUsers(game.PlayersGameStartedWith, new ServerPacketAllPlayersLoaded());
            }
        } catch (err) {
            Logger.Error(err);
        }
    }    
}