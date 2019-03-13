import ClientPacketLobbyJoin from "../packets/client/ClientPacketLobbyJoin";
import Logger from "../logging/Logger";
import User from "../sessions/User";
import Lobby from "../multiplayer/Lobby";

export default class LobbyJoinHandler {
    /**
     * Handles when a user joins the multiplayer lobby.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketLobbyJoin): Promise<void> {
        try {
            Lobby.AddUser(user);
            
            // TODO: Send them all the games.
        } catch (err) {
            return Logger.Error(err);
        }
    }
}