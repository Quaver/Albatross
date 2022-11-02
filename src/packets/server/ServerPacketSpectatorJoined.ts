import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../handlers/rooster/User";

@JsonObject("ServerPacketSpectatorJoined")
export default class ServerPacketSpectatorJoined extends Packet {
    public Id: PacketId = PacketId.ServerSpectatorJoined;

    @JsonProperty("u")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}