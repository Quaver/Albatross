import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";

@JsonObject("ServerPacketSpectatorLeft")
export default class ServerPacketSpectatorLeft extends Packet {
    public Id: PacketId = PacketId.ServerSpectatorLeft;

    @JsonProperty("u")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}