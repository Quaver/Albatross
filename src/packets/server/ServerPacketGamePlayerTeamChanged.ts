import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";
import MultiplayerTeam from "../../multiplayer/MultiplayerTeam";

@JsonObject("ServerPacketGamePlayerTeamChanged")
export default class ServerPacketGamePlayerTeamChanged extends Packet {
    public Id: PacketId = PacketId.ServerGamePlayerTeamChanged;

    @JsonProperty("u")
    public UserId: number;

    @JsonProperty("t")
    public Team: MultiplayerTeam;

    constructor(user: User, team: MultiplayerTeam) {
        super();
        this.UserId = user.Id;
        this.Team = team;
    }
}