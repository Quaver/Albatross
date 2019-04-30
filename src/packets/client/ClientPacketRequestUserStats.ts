import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketRequestUserStats")
export default class ClientPacketRequestUserStats extends Packet {
    public Id: PacketId = PacketId.ClientRequestUserStats;

    @JsonProperty("u")
    public Users: number[] = [];
}