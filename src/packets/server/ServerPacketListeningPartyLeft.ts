import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketListeningPartyLeft")
export default class ServerPacketListeningPartyLeft extends Packet {
    public Id: PacketId = PacketId.ServerListeningPartyLeft;
}