import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketPlayerFinished")
export default class ClientPacketPlayerFinished extends Packet {
    public Id: PacketId = PacketId.ClientPlayerFinished;
}