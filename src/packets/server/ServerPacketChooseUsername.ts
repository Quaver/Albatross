import Packet from "../Packet";
import PacketId from "../PacketId";

export default class ServerPacketChooseUsername extends Packet {
    /**
     */
    public Id: PacketId = PacketId.ServerChooseUsername;
}