import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGamePlayerChangeModifiers")
export default class ClientPacketGamePlayerChangeModifiers extends Packet {
    public Id: PacketId = PacketId.ClientGamePlayerChangeModifiers;

    @JsonProperty("m")
    public Modifiers: string = "0";
}