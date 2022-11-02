import User from "./rooster/User";
import ClientPacketSpectatorReplayFrames from "../packets/client/ClientPacketSpectatorReplayFrames";
import Logger from "../logging/Logger";

export default class SpectatotReplayFramesHandler {
    /**
     * Handles when the client receives spectator replay frames from the server
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketSpectatorReplayFrames): Promise<void> {
        try {
            await user.HandleNewSpectatorReplayFrames(packet);
        } catch (err) {
            Logger.Error(err);
        }
    }
}