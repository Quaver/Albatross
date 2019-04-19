import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerFreeModType from "../../multiplayer/MultiplayerFreeModType";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketFreeModTypeChanged")
export default class ServerPacketFreeModTypeChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameFreeModTypeChanged;

    @JsonProperty("fm")
    public FreeModType: MultiplayerFreeModType;

    constructor(game: MultiplayerGame) {
        super();
        this.FreeModType = game.FreeModType;
    }
}