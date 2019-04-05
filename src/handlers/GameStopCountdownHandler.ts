import User from "../sessions/User";
import ClientPacketGameStopCountdown from "../packets/client/ClientPacketGameStopCountdown";
import Logger from "../logging/Logger";

export default class GameStopCountdownHandler {
    /**
     * Handles when a user wants to stop the countdown for a game.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameStopCountdown): Promise<void> {
        try {
            user.HandleMultiplayerCountdownStop();
        } catch (err) {
            return Logger.Error(err);
        }
    } 
}