import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketGameEnded")
export default class ServerPacketGameEnded extends Packet {
    public Id: PacketId = PacketId.ServerGameEnded;
}