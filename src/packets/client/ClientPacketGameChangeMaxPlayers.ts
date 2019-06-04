import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameChangeMaxPlayers")
export default class ClientPacketGameChangeMaxPlayers extends Packet {
    public Id: PacketId = PacketId.ClientGameChangeMaxPlayers;

    @JsonProperty("n")
    public NumPlayers: number = -1;
}