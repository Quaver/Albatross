import User from "../sessions/User";
import ClientPacketStartSpectatePlayer from "../packets/client/ClientPacketStartSpectatePlayer";
import Logger from "../logging/Logger";

export default class StartSpectatePlayerHandler {
    /**
     * Handles when the client wants to  start 
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketStartSpectatePlayer): Promise<void> {
        try {
            await user.StartSpectatingPlayer(packet.UserId);
        } catch (err) {
            Logger.Error(err);
        }
    }
}