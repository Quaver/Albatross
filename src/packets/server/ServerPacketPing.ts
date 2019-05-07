import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ServerPacketPing")
export default class ServerPacketPing extends Packet {
    /**
     */
    public Id: PacketId = PacketId.ServerPing;
}