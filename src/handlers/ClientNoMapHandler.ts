import ClientPacketGameNoMap from "../packets/client/ClientPacketNoMap";
import Logger from "../logging/Logger";
import User from "../sessions/User";

export default class ClientNoMapHandler {
    /**
     * Handles when the client says they don't have a map
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameNoMap): Promise<void> {
        try {
            user.HandleNoMultiplayerGameMap();
        } catch (err) {
            return Logger.Error(err);
        }
    }
}