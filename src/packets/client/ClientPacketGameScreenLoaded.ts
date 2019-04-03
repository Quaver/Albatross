import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameScreenLoaded")
export default class ClientPacketGameScreenLoaded extends Packet {
    public Id: PacketId = PacketId.ClientGameScreenLoaded;
}