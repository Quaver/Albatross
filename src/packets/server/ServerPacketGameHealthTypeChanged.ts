import Packet from "../Packet";
import { JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";

@JsonProperty("ServerPacketGameHealthTypeChanged")
export default class ServerPacketGameHealthTypeChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameHealthTypeChanged;

    @JsonProperty("ht")
    public HealthType: MultiplayerHealthType;

    constructor(game: MultiplayerGame) {
        super();
        this.HealthType = game.HealthType;
    }
}