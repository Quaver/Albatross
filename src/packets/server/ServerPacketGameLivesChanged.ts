import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";

@JsonObject("ServerPacketGameLivesChanged")
export default class ServerPacketGameLivesChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameLivesChanged;

    @JsonProperty("l")
    public Lives: number;

    constructor(game: MultiplayerGame) {
        super();
        this.Lives = game.Lives;
    }
}