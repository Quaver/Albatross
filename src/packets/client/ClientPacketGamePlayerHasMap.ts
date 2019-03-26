import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGamePlayerHasMap")
export default class ClientPacketGamePlayerHasMap extends Packet {
    public Id: PacketId = PacketId.ClientGamePlayerHasMap;
}