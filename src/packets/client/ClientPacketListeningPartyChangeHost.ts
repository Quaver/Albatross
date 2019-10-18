import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketListeningPartyChangeHost")
export default class ClientPacketListeningPartyChangeHost extends Packet {
    public Id: PacketId = PacketId.ClientListeningPartyChangeHost;

    @JsonProperty("u")
    public UserId: number = -1;
}