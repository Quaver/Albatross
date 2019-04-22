import User from "../sessions/User";
import ClientPacketLeaveGame from "../packets/client/ClientPacketLeaveGame";
import Logger from "../logging/Logger";
import MultiplayerGame from "../multiplayer/MultiplayerGame";

export default class GameLeaveHandler {
    /**
     * Handles when a user wants to leave a multiplayer game.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketLeaveGame): Promise<void> {
        try {
            await user.LeaveMultiplayerGame();
        } catch (err) {
            Logger.Error(err);
        }
    }
}