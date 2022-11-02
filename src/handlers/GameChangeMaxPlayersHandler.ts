import User from "./rooster/User";
import ClientPacketGameChangeMaxPlayers from "../packets/client/ClientPacketGameChangeMaxPlayers";
import Logger from "../logging/Logger";

export default class GameChangeMaxPlayersHandler {
    /**
     * Handles when the client wants to change the max player count of the game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameChangeMaxPlayers): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            user.CurrentGame.ChangeMaxPlayers(packet.NumPlayers);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}