import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGamePlayerReady")
export default class ClientPacketGamePlayerReady extends Packet {
    public Id: PacketId = PacketId.ClientGamePlayerReady;
}