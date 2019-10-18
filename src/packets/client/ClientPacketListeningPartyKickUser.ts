import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketListeningPartyKickUser")
export default class ClientPacketListeningPartyKickUser extends Packet {
    public Id: PacketId = PacketId.ClientListeningPartyKickUser;

    @JsonProperty("u")
    public UserId: number = -1;
}