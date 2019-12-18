import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketChangeGamePassword")
export default class ClientPacketChangeGamePassword extends Packet {
    public Id: PacketId = PacketId.ClientPacketChangeGamePassword;

    @JsonProperty("p")
    public Password: string | null = null;
}