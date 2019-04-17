import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";

@JsonObject("ServerPacketGameRulesetChanged")
export default class ServerPacketGameRulesetChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameRulesetChanged;

    @JsonProperty("r")
    public Ruleset: MultiplayerGameRuleset;

    constructor(game: MultiplayerGame) {
        super();
        this.Ruleset = game.Ruleset;
    }
}