import Packet from "../Packet";
import PacketId from "../PacketId";

export default class ClientPacketLobbyLeave extends Packet {
    public Id: PacketId = PacketId.ClientLobbyLeave;
}