import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketAllPlayersSkipped")
export default class ServerPacketAllPlayersSkipped extends Packet {
    public Id: PacketId = PacketId.ServerGameAllPlayersSkipped;
}