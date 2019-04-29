import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketGameTeamWinCount")
export default class ServerPacketGameTeamWinCount extends Packet {
    public Id: PacketId = PacketId.ServerGameTeamWinCount;

    @JsonProperty("r")
    public RedTeamWins: number;

    @JsonProperty("b")
    public BlueTeamWins: number;

    constructor(game: MultiplayerGame) {
        super();
        
        this.RedTeamWins = game.RedTeamWins;
        this.BlueTeamWins = game.BlueTeamWins;
    }
}