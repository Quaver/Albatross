import User from "../sessions/User";
import ClientPacketGamePlayerReady from "../packets/client/ClientPacketGamePlayerReady";
import Logger from "../logging/Logger";

export default class GamePlayerReadyHandler {
    /**
     * Handles when the client lets us know that they're ready to play in their multiplayer game.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGamePlayerReady): Promise<void> {
        try {
            user.HandleMultiplayerGameReady();
        } catch (err) {
            return Logger.Error(err);
        }
    }
}