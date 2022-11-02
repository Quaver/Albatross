import User from "./rooster/User";
import ClientPacketListeningPartyUserHasSong from "../packets/client/ClientPacketListeningPartyUserHasSong";
import Logger from "../logging/Logger";
import PacketId from "../packets/PacketId";

export default class ListeningPartyUserHasSongHandler {
    /**
     * Handles when the client informs us that they now have the map.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketListeningPartyUserHasSong): Promise<void> {
        try {
            if (user.ListeningParty == null)
                return Logger.Warning(`${user.ToNameIdString()} sent a ${PacketId[packet.Id]} packet, but they are not in a listening party!`);

            await user.ListeningParty.HandleUserHasSong(user);
        } catch (err) {
            Logger.Error(err);
        }
    }
}