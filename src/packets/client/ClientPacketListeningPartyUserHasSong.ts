import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject } from "json2typescript";

@JsonObject("ClientPacketListeningPartyUserHasSong")
export default class ClientPacketListeningPartyUserHasSong extends Packet {
    public Id: PacketId = PacketId.ClientListeningPartyUserHasSong;
}