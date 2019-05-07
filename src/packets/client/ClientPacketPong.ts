import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ClientPacketPong")
export default class ClientPacketPong extends Packet {
    /**
     */
    public Id: PacketId = PacketId.ClientPong;
}