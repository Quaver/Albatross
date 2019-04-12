import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";

@JsonObject("ServerPacketGameNameChanged")
export default class ServerPacketGameNameChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameNameChanged;

    @JsonProperty("n")
    public Name: string;

    constructor(game: MultiplayerGame) {
        super();
        this.Name = game.Name;
    }
}