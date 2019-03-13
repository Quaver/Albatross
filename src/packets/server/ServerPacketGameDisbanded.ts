import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";

@JsonObject("ServerPacketGameDisbanded")
export default class ServerPacketGameDisbanded extends Packet {

    public Id: PacketId = PacketId.ServerGameDisbanded;

    @JsonProperty("gid")
    public GameId: string

    constructor(game: MultiplayerGame) {
        super();
        this.GameId = game.Id;
    }
}