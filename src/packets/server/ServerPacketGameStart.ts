import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketGameStart")
export default class ServerPacketGameStart extends Packet {
    public Id: PacketId = PacketId.ServerGameStart;
}