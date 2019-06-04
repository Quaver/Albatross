import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";

@JsonObject("ClientPacketGameChangeHealthType")
export default class ClientPacketGameChangeHealthType extends Packet {
    public Id: PacketId = PacketId.ClientGameChangeHealthType;

    @JsonProperty("t")
    public HealthType: MultiplayerHealthType = MultiplayerHealthType.ManualRegeneration;
}