import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";
import ModIdentifiers from "../../enums/ModIdentifiers";

@JsonObject("ServerPacketGameChangeModifiers")
export default class ServerPacketGameChangeModifiers extends Packet {
    public Id: PacketId = PacketId.ServerGameChangeModifiers;

    @JsonProperty("md")
    public Modifiers: string;

    @JsonProperty("d")
    public DifficultyRating: number;

    constructor(game: MultiplayerGame) {
        super();

        this.Modifiers = game.Modifiers;
        this.DifficultyRating = game.DifficultyRating; 
    }
}