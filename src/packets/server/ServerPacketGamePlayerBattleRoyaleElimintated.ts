import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import User from "../../sessions/User";

@JsonObject("ServerPacketGamePlayerBattleRoyaleEliminated")
export default class ServerPacketGamePlayerBattleRoyaleEliminated extends Packet {
    public Id: PacketId = PacketId.ServerGamePlayerBattleRoyaleEliminated;

    @JsonProperty("u")
    public UserId: number

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}