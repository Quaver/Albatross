import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameChangeAutoHostRotation")
export default class ClientPacketGameChangeAutoHostRotation extends Packet {
    public Id: PacketId = PacketId.ClientGameChangeAutoHostRotation;

    @JsonProperty("o")
    public On: boolean = false; 
}