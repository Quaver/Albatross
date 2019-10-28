import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketInviteToGame")
export default class ClientPacketInviteToGame extends Packet {

    public Id: PacketId = PacketId.ClientInviteToGame;

    @JsonProperty("u")
    public UserId: number = -1;
}