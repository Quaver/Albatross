import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import { json } from "express";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketLongNotePercentageChanged")
export default class ServerPacketLongNotePercentageChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameLongNotePercentageChanged;

    @JsonProperty("mn")
    public Minimum: number;

    @JsonProperty("mx")
    public Maximum: number;

    constructor(game: MultiplayerGame) {
        super();

        this.Minimum = game.MinimumLongNotePercentage;
        this.Maximum = game.MaximumLongNotePercentage;
    }
}