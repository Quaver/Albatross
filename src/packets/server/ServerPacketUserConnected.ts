import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonProperty, JsonObject } from "json2typescript";
import User from "../../sessions/User";

@JsonObject("ServerPacketUserConnected")
export default class ServerPacketUserConnected extends Packet {

    public Id: PacketId = PacketId.ServerUserConnected;

    @JsonProperty("u")
    public User: object;

    constructor(user: User) {
        super();
        this.User = user.Serialize();
    }
}