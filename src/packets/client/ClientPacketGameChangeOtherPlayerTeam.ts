import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";
import MultiplayerTeam from "../../multiplayer/MultiplayerTeam";

@JsonObject("ClientPacketChangeOtherPlayerTeam")
export default class ClientPacketGameChangeOtherPlayerTeam extends Packet {
    public Id: PacketId = PacketId.ClientGameChangeOtherPlayerTeam;

    @JsonProperty("u")
    public UserId: number = -1;

    @JsonProperty("t")
    public Team: MultiplayerTeam = MultiplayerTeam.Red;
}