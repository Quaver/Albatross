import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketGameMapsetShared")
export default class ServerPacketGameMapsetShared extends Packet {
    public Id: PacketId = PacketId.ServerGameMapsetShared;

    @JsonProperty("s")
    public IsShared: boolean;

    constructor(game: MultiplayerGame) {
        super();
        this.IsShared = game.IsMapsetShared;
    }
}