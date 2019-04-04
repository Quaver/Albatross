import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGamePlayerNotReady")
export default class ClientPacketGamePlayerNotReady extends Packet {
    public Id: PacketId = PacketId.ClientGamePlayerNotReady;
}