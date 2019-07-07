import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketStartSpectatePlayer")
export default class ClientPacketStartSpectatePlayer extends Packet {
    public Id: PacketId = PacketId.ClientStartSpectatePlayer;

    @JsonProperty("u")
    public UserId: number = -1;
}