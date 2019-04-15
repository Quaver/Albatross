import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";

@JsonObject("ServerPacketGameHostRotationChanged")
export default class ServerPacketGameHostRotationChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameHostRotationChanged;

    @JsonProperty("h")
    public HostRotation: boolean;

    constructor(game: MultiplayerGame) {
        super();
        this.HostRotation = game.AutoHostRotation;
    }
}