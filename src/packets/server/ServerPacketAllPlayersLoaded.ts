import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketAllPlayersLoaded")
export default class ServerPacketAllPlayersLoaded extends Packet {
    public Id: PacketId = PacketId.ServerAllPlayersLoaded;
}