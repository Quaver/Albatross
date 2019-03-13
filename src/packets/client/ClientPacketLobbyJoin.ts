import Packet from "../Packet";
import PacketId from "../PacketId";

export default class ClientPacketLobbyJoin extends Packet {
    public Id: PacketId = PacketId.ClientLobbyJoin;
}