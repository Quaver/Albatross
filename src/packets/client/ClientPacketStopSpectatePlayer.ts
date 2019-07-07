import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketStopSpectatePlayer")
export default class ClientPacketStopSpectatePlayer extends Packet {
    public Id: PacketId = PacketId.ClientStopSpectatePlayer;
}