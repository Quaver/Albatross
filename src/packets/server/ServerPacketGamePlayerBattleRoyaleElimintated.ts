import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import User from "../../handlers/rooster/User";

@JsonObject("ServerPacketGamePlayerBattleRoyaleEliminated")
export default class ServerPacketGamePlayerBattleRoyaleEliminated extends Packet {
    public Id: PacketId = PacketId.ServerGamePlayerBattleRoyaleEliminated;

    @JsonProperty("u")
    public UserId: number;

    @JsonProperty("r")
    public Rank: number;

    constructor(user: User, rank: number) {
        super();
        this.UserId = user.Id;
        this.Rank = rank;
    }
}