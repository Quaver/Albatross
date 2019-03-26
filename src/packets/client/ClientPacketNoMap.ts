import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameNoMap")
export default class ClientPacketGameNoMap extends Packet {
    public Id: PacketId = PacketId.ClientGamePlayerNoMap;
}