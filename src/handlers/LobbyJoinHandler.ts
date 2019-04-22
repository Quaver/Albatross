import ClientPacketLobbyJoin from "../packets/client/ClientPacketLobbyJoin";
import Logger from "../logging/Logger";
import User from "../sessions/User";
import Lobby from "../multiplayer/Lobby";
import ServerPacketMultiplayerGameInfo from "../packets/server/ServerPacketMultiplayerGameInfo";

export default class LobbyJoinHandler {
    /**
     * Handles when a user joins the multiplayer lobby.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketLobbyJoin): Promise<void> {
        try {
            await user.LeaveMultiplayerGame();
            Lobby.AddUser(user);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}