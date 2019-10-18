import User from "../sessions/User";
import ClientPacketListeningPartyChangeHost from "../packets/client/ClientPacketListeningPartyChangeHost";
import Logger from "../logging/Logger";
import PacketId from "../packets/PacketId";

export default class ListeningPartyChangeHostHandler {
    /**
     * Handles when a user requests to change the host of the listening party
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketListeningPartyChangeHost): Promise<void> {
        try {
            if (user.ListeningParty == null)
                return Logger.Warning(`${user.ToNameIdString()} sent a ${PacketId[packet.Id]} packet, but they are not in a listening party!`);

            if (user.ListeningParty.Host != user)
                return Logger.Warning(`${user.ToNameIdString()} sent a ${PacketId[packet.Id]} packet, but they are not host of the listening party!`);
  
            await user.ListeningParty.ChangeHost(packet.UserId);
        } catch (err) {
            Logger.Error(err);
        }
    }
}