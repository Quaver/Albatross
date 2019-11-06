import User from "../sessions/User";
import ClientPacketTwitchUnlink from "../packets/client/ClientPacketTwitchUnlink";
import Logger from "../logging/Logger";

export default class TwitchUnlinkHandler {
    /**
     * Handles when a user wants to unlink their twitch account
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketTwitchUnlink): Promise<void> {
        try {
            await user.UnlinkTwitch();
        } catch (err) {
            Logger.Error(err);
        }
    }
}