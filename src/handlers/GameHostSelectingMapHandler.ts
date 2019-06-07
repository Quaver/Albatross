import User from "../sessions/User";
import ClientPacketGameHostSelectingMap from "../packets/client/ClientPacketGameHostSelectingMap";
import Logger from "../logging/Logger";

export default class GameHostSelectingMapHandler {
    /**
     * Handles when the host of a game is selecting/not selecting a map
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameHostSelectingMap): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            user.CurrentGame.HandleHostSelectingMap(packet.IsSelecting);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}