import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerFreeModType from "../../multiplayer/MultiplayerFreeModType";

@JsonObject("ClientPacketGameChangeFreeModtype")
export default class ClientPacketGameChangeFreeModType extends Packet {
    public Id: PacketId = PacketId.ClientGameChangeFreeModType;

    @JsonProperty("t")
    public Type: MultiplayerFreeModType = MultiplayerFreeModType.None;
}