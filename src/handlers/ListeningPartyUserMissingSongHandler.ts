import User from "./rooster/User";
import ClientPacketListeningPartyUserMissingSong from "../packets/client/ClientPacketListeningPartyUserMissingSong";
import Logger from "../logging/Logger";
import PacketId from "../packets/PacketId";

export default class ListeningPartyUserMissingSongHandler {
    /**
     * Handles when the user informs us that they're missing the active song.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketListeningPartyUserMissingSong): Promise<void> {
        try {
            if (user.ListeningParty == null)
                return Logger.Warning(`${user.ToNameIdString()} sent a ${PacketId[packet.Id]} packet, but they are not in a listening party!`);

            await user.ListeningParty.HandleUserMissingSong(user);
        } catch (err) {
            Logger.Error(err);
        }
    }
}