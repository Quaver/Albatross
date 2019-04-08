import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";

@JsonObject("ServerPacketGameAllowedModesChanged")
export default class ServerPacketGameAllowedModesChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameAllowedModesChanged;

    @JsonProperty("m")
    public Modes: number[];

    constructor(game: MultiplayerGame) {
        super();
        this.Modes = game.AllowedGameModes;
    }
}