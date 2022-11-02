import ClientPacketLobbyJoin from "../packets/client/ClientPacketLobbyJoin";
import Logger from "../logging/Logger";
import User from "./rooster/User";
import Lobby from "../multiplayer/Lobby";
import ClientPacketLobbyLeave from "../packets/client/ClientPacketLobbyLeave";

export default class LobbyLeaveHandler {
    /**
     * Handles when a user leaves the multiplayer lobby.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketLobbyLeave): Promise<void> {
        try {
            Lobby.RemoveUser(user);
            
            // TODO: Send them all the games.
        } catch (err) {
            return Logger.Error(err);
        }
    }
}