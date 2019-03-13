import User from "../sessions/User";
import ClientPacketCreateGame from "../packets/client/ClientPacketCreateGame";
import Logger from "../logging/Logger";
import MultiplayerGame from "../multiplayer/MutliplayerGame";
import MultiplayerGameType from "../multiplayer/MultiplayerGameType";
import Lobby from "../multiplayer/Lobby";

export default class CreateGameHandler {
    /**
     * Handles when the user wants to create a multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketCreateGame): Promise<void> {
        try {
            // First run a check to see if the user is in a multiplayer game.
            if (user.IsInMultiplayerGame())
                return Logger.Warning(`User is in multiplayer game, but trying to create a new one?`)

            if (!packet.Game)
                return Logger.Warning("Received game create packet without a game object.");

            if (!packet.Game.Name)
                return Logger.Warning("Received empty game name");

            if (!(packet.Game.Type in MultiplayerGameType))
                return Logger.Warning("Received invalid game type");

            // Create a brand new match. In the constructor, initial game settings are validated.
            const game: MultiplayerGame = MultiplayerGame.Create(packet.Game.Type, packet.Game.Name, packet.Game.Password, packet.Game.MaxPlayers);

            // Just set the game to null to prevent accidental usage of it since we now have two games.
            packet.Game = null;

            // Create the actual game.
            Lobby.CreateGame(game);
            user.JoinMultiplayerGame(game, game.Password);
            
            // Set the host
            if (game.Type == MultiplayerGameType.Custom)
                game.ChangeHost(user);
                
        } catch (err) {
            return Logger.Error(err);
        }
    }    
}