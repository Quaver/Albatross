import User from "../sessions/User";
import ClientPacketGamePlayerNotReady from "../packets/client/ClientPacketGamePlayerNotReady";
import Logger from "../logging/Logger";

export default class GamePlayerNotReadyHandler {
    /**
     * Handles when a player tells us they're no longer ready in their multiplayer game.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGamePlayerNotReady): Promise<void> {
        try {
            user.HandleMultiplayerGameNotReady();
        } catch (err) {
            return Logger.Error(err);
        }
    }
}