import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketGameKicked")
export default class ServerPacketGameKicked extends Packet {
    public Id: PacketId = PacketId.ServerGameKicked;
}