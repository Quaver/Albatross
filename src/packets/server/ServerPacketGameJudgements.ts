import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonProperty, JsonObject } from "json2typescript";
import User from "../../handlers/rooster/User";

@JsonObject("ServerPacketGameJudgements")
export default class ServerPacketGameJudgements extends Packet {
    public Id: PacketId = PacketId.ServerGameJudgements;

    @JsonProperty("u")
    public UserId: number;

    @JsonProperty("j")
    public Judgements: number[] = [];

    constructor(user: User, judgements: number[]) {
        super();

        this.UserId = user.Id;
        this.Judgements = judgements;
    }
}