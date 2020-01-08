import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketSpectateMultiplayerGame")
export default class ServerPacketSpectateMultiplayerGame extends Packet {
    public Id: PacketId = PacketId.ServerSpectateMultiplayerGame;

    @JsonProperty("gid")
    public GameId: string;

    constructor(game: MultiplayerGame) {
        super();
        this.GameId = game.Id;
    }
}