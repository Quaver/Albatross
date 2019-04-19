import ClientPacketJoinGame from "../packets/client/ClientPacketJoinGame";
import Logger from "../logging/Logger";
import User from "../sessions/User";
import Lobby from "../multiplayer/Lobby";
import MultiplayerGame from "../multiplayer/MultiplayerGame";

export default class JoinGameHandler {
    /**
     * Handles when the client is requesting to join a multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketJoinGame): Promise<void> {
        try {
            return user.JoinMultiplayerGame(Lobby.Games[packet.GameId], packet.Password);
        } catch (err) {
            Logger.Error(err); 
        }
    }
}