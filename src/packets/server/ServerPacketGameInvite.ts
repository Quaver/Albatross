import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";
import User from "../../sessions/User";

@JsonObject("ServerPacketGameInvite")
export default class ServerPacketGameInvite extends Packet {
    public Id: PacketId = PacketId.ServerGameInvite;

    @JsonProperty("m")
    public MatchId: string;

    @JsonProperty("s")
    public Sender: string;

    constructor(game: MultiplayerGame, user: User) {
        super();
        this.MatchId = game.Id;
        this.Sender = user.Username;
    }
}