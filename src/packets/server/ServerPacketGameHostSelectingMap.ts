import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketGameHostSelectingMap")
export default class ServerPacketGameHostSelectingMap extends Packet {
    public Id: PacketId = PacketId.ServerGameHostSelectingMap

    @JsonProperty("s")
    public IsSelecting: boolean;

    constructor(game: MultiplayerGame) {
        super();
        this.IsSelecting = game.HostSelectingMap;
    }
}