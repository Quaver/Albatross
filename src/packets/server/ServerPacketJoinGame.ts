import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";

@JsonObject("ServerPacketJoinGame")
export default class ServerPacketJoinGame extends Packet {

    public Id: PacketId = PacketId.ServerJoinGame;

    @JsonProperty("gid")
    public GameId: string;

    constructor(game: MultiplayerGame) {
        super();
        this.GameId = game.Id;
    }
}