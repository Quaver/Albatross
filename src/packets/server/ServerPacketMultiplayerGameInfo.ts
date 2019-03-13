import Packet from "../Packet";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";
import { JsonObject, JsonProperty, JsonConvert } from "json2typescript";

@JsonObject("ServerPacketMultiplayerGameInfo")
export default class ServerPacketMultiplayerGameInfo extends Packet {
    public Id: PacketId = PacketId.ServerMultiplayerGameInfo;

    @JsonProperty("m")
    public Game: any

    constructor(game: MultiplayerGame) {
        super();

        const jsonConvert: JsonConvert = new JsonConvert();
        this.Game = jsonConvert.serializeObject(game);
    }
}