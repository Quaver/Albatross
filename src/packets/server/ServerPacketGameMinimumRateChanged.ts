import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketGameMinimumRateChanged")
export default class ServerPacketGameMinimumRateChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameMinimumRateChanged;

    @JsonProperty("r")
    public Rate: number;

    constructor(game: MultiplayerGame) {
        super();
        this.Rate = game.MinimumRate;
    }
}