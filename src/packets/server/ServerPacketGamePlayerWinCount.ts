import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerPlayerWins from "../../multiplayer/MultiplayerPlayerWins";

@JsonObject("ServerPacketGamePlayerWinCount")
export default class ServerPacketGamePlayerWinCount extends Packet {
    public Id: PacketId = PacketId.ServerGamePlayerWinCount;

    @JsonProperty("u")
    public UserId: number;

    @JsonProperty("w")
    public Wins: number;

    constructor(wins: MultiplayerPlayerWins) {
        super();
        this.UserId = wins.Id;
        this.Wins = wins.Wins;
    }
}