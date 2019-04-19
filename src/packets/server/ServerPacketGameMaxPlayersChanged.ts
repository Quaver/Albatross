import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketGameMaxPlayersChanged")
export default class ServerPacketGameMaxPlayersChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameMaxPlayersChanged;

    @JsonProperty("p")
    public Players: number

    constructor(game: MultiplayerGame) {
        super();
        this.Players = game.MaxPlayers;
    }
}