import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";
import PacketId from "../PacketId";

@JsonObject("ServerPacketDifficultyRangeChanged")
export default class ServerPacketDifficultyRangeChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameDifficultyRangeChanged;

    @JsonProperty("mind")
    public MinimumDifficulty: number;

    @JsonProperty("maxd")
    public MaximumDifficulty: number;

    constructor(game: MultiplayerGame) { 
        super();

        this.MinimumDifficulty = game.MinimumDifficultyRating;
        this.MaximumDifficulty = game.MaximumDifficultyRating;
    }
}