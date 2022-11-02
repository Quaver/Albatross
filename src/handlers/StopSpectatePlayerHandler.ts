import User from "./rooster/User";
import ClientPacketStopSpectatePlayer from "../packets/client/ClientPacketStopSpectatePlayer";
import Logger from "../logging/Logger";

export default class StopSpectatePlayerHandler {
    /**
     * Stops spectating all players
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketStopSpectatePlayer): Promise<void> {
        try {
            await user.StopSpectatingAllUsers();
        } catch (err) {
            Logger.Error(err);
        }
    }
}