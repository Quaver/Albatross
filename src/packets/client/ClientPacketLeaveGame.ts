import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject } from "json2typescript";

@JsonObject("ClientPacketLeaveGame")
export default class ClientPacketLeaveGame extends Packet {
    public Id: PacketId = PacketId.ClientLeaveGame;
}