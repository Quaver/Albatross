import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketChangeGameName")
export default class ClientPacketChangeGameName extends Packet {
    public Id: PacketId = PacketId.ClientPacketChangeGameName;

    @JsonProperty("n")
    public Name: string = "";
}