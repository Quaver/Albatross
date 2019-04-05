import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameStartCountdown")
export default class ClientPacketGameStartCountdown extends Packet {
    public Id: PacketId = PacketId.ClientGameStartCountdown;
}