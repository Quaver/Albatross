import User from "../sessions/User";
import ClientPacketListeningPartyKickUser from "../packets/client/ClientPacketListeningPartyKickUser";
import Logger from "../logging/Logger";
import PacketId from "../packets/PacketId";

export default class ListeningPartyKickUserHandler {
    /**
     * Handles when the client wishes to kick someone from their listening party
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketListeningPartyKickUser): Promise<void> {
        try {
            if (user.ListeningParty == null)
                return Logger.Warning(`${user.ToNameIdString()} sent a ${PacketId[packet.Id]} packet, but they are not in a listening party!`);

            if (user.ListeningParty.Host != user)
                return Logger.Warning(`${user.ToNameIdString()} sent a ${PacketId[packet.Id]} packet, but they are not host of the listening party!`);

            await user.ListeningParty.KickUser(packet.UserId);
        } catch (err) {
            Logger.Error(err);
        }
    }
}