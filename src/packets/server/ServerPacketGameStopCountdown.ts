import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketGameStopCountdown")
export default class ServerPacketGameStopCountdown extends Packet {
    public Id: PacketId = PacketId.ServerGameStopCountdown;
}