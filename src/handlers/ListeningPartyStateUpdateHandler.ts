import ClientPacketListeningPartyStateUpdate from "../packets/client/ClientPacketListeningPartyStateUpdate";
import User from "./rooster/User";
import Logger from "../logging/Logger";

export default class ListeningPartyStateUpdateHandler {
    /**
     * Handles when the host of a listening party updates the state of it
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketListeningPartyStateUpdate): Promise<void> {
        try {
            if (user.ListeningParty == null)
                return Logger.Warning(`${user.ToNameIdString()} sent a listening party update packet, but they aren't in an active party`);

            await user.ListeningParty.UpdateState(packet);
        } catch (err) {
            Logger.Error(err);
        }
    }
}