import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerTeam from "../../multiplayer/MultiplayerTeam";

@JsonObject("ClientPacketGamePlayerTeamChanged")
export default class ClientPacketGamePlayerTeamChanged extends Packet {
    public Id: PacketId = PacketId.ClientGamePlayerTeamChanged;

    @JsonProperty("t")
    public Team: MultiplayerTeam = MultiplayerTeam.Red;
}