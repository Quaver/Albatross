import { JsonObject, JsonProperty } from "json2typescript";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";
import Packet from "../Packet";
import PacketId from "../PacketId";

@JsonObject("ServerPacketGameTournamentMode")
export default class ServerPacketGameTournamentMode extends Packet {
    public Id: PacketId = PacketId.ServerGameTournamentMode;

    @JsonProperty("trn")
    public TournamentMode: boolean;


    constructor(game: MultiplayerGame) {
        super();
        this.TournamentMode = game.TournamentMode;
    }
}