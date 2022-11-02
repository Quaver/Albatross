import User from "./rooster/User";
import ClientPacketGamePlayerHasMap from "../packets/client/ClientPacketGamePlayerHasMap";
import Logger from "../logging/Logger";

export default class GamePlayerHasMapHandler {
    /**
     * Handles when the client now has the selected map in their multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGamePlayerHasMap): Promise<void> {
        try {
            return user.HandleNowHasMultiplayerGameMap();
        } catch (err) {
            return Logger.Error(err);
        }
    }
}