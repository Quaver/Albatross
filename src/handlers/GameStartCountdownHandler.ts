import ClientPacketGameStartCountdown from "../packets/client/ClientPacketGameStartCountdown";
import Logger from "../logging/Logger";
import User from "../sessions/User";

export default class GameStartCountdownHandler {
    /**
     * Handles when the host ofthe game 
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameStartCountdown): Promise<void>{
        try {
            await user.HandleMultiplayerCountdownStart();
        } catch (err) {
            Logger.Error(err);
        }
    }
}