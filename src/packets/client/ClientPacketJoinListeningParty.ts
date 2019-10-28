import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketJoinListeningParty")
export default class ClientPacketJoinListeningParty extends Packet {

    public Id: PacketId = PacketId.ClientJoinListeningParty;

    @JsonProperty("u")
    public User: number = -1;
}