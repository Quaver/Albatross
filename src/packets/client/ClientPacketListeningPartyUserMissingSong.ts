import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketListeningPartyUserMissingSong")
export default class ClientPacketListeningPartyUserMissingSong extends Packet {
    public Id: PacketId = PacketId.ClientListeningPartyUserMissingSong;
}