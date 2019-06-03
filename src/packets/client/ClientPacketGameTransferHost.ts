import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameTransferHost")
export default class ClientPacketGameTransferHost extends Packet {
    public Id: PacketId = PacketId.ClientGameTransferHost;

    @JsonProperty("u")
    public UserId: number = -1;
}