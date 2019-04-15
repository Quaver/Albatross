import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameAcceptInvite")
export default class ClientPacketGameAcceptInvite extends Packet {
    public Id: PacketId = PacketId.ClientGameAcceptInvite;

    @JsonProperty("m")
    public MatchId: string = "";
}