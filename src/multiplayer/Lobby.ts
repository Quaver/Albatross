import * as _ from "lodash";
import User from "../sessions/User";
import MultiplayerGame from "./MutliplayerGame";
import IUniqueIdtoGameMap from "./maps/IUniqueIdToGameMap";
import Logger from "../logging/Logger";
import Albatross from "../Albatross";
import ServerPacketMultiplayerGameInfo from "../packets/server/ServerPacketMultiplayerGameInfo";
import ServerPacketGameDisbanded from "../packets/server/ServerPacketGameDisbanded";
import MultiplayerGameType from "./MultiplayerGameType";
import Bot from "../bot/Bot";
import MultiplayerGameRuleset from "./MultiplayerGameRuleset";
import GameMode from "../enums/GameMode";

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
    public static CreateGame(game: MultiplayerGame): void {
        Lobby.Games[game.Id] = game;
        Albatross.SendToUsers(Lobby.Users, new ServerPacketMultiplayerGameInfo(game));
        
        Logger.Success(`Multiplayer Game: "${game.Name}" <${game.Id}> has been created.`);
    }

    /**
     * Disbands a multiplayer game
     * @param game 
     */
    public static DeleteGame(game: MultiplayerGame): void {
        delete Lobby.Games[game.Id];
        Albatross.SendToUsers(Lobby.Users, new ServerPacketGameDisbanded(game));

        Logger.Success(`Multiplayer Game: "${game.Name}" <${game.Id}> has been disbanded.`);
    }
}