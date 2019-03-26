import User from "../sessions/User";
import ClientPacketPlayerFinished from "../packets/client/ClientPacketPlayerFinished";
import Logger from "../logging/Logger";

export default class ClientPlayerFinishedHandler {
    /**
     * Handles when the player successfully finishes the map
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketPlayerFinished): Promise<void> {
        try {
            return user.FinishPlayingMultiplayerGame();
        } catch (err) {
            return Logger.Error(err);
        }
    }
 }