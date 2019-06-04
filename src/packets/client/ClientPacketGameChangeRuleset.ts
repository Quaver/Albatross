import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";

@JsonObject("ClientPacketGameChangeRuleset")
export default class ClientPacketGameChangeRuleset extends Packet {
    public Id: PacketId = PacketId.ClientGameChangeRuleset;

    @JsonProperty("r")
    public Ruleset: MultiplayerGameRuleset = MultiplayerGameRuleset.Free_For_All;
}