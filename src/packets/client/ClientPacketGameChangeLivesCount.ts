import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameChangeLivesCount")
export default class ClientPacketGameChangeLivesCount extends Packet {
    public Id: PacketId = PacketId.ClientGameChangeLivesCount;

    @JsonProperty("n")
    public NumLives: number = 3;
}