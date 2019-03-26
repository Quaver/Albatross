import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameJudgements")
export default class ClientPacketGameJudgements extends Packet {
    public Id: PacketId = PacketId.ClientGameJudgements;

    @JsonProperty("j")
    public Judgements: number[] = [];
}