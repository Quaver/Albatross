import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";

@JsonObject("ServerPacketStopSpectatePlayer")
export default class ServerPacketStopSpectatePlayer extends Packet {
    public Id: PacketId = PacketId.ServerStopSpectatePlayer;

    @JsonProperty("u")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}