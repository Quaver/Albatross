import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import User from "../../handlers/rooster/User";

@JsonObject("ServerPacketChangeGameHost")
export default class ServerPacketChangeGameHost extends Packet {

    public Id: PacketId = PacketId.ServerChangeGameHost;

    @JsonProperty("u")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}