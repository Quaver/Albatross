import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketTwitchUnlink")
export default class ClientPacketTwitchUnlink extends Packet {
    public Id: PacketId = PacketId.ClientTwitchUnlink;
}