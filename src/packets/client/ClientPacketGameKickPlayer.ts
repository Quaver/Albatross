import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameKickPlayer")
export default class ClientPacketGameKickPlayer extends Packet {
    public Id: PacketId = PacketId.ClientGameKickPlayer;

    @JsonProperty("u")
    public UserId: number = -1;
}