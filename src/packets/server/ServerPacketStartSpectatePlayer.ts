import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../handlers/rooster/User";

@JsonObject("ServerPacketStartSpectatePlayer")
export default class ServerPacketStartSpectatePlayer extends Packet {
    public Id: PacketId = PacketId.ServerStartSpectatePlayer;

    @JsonProperty("u")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}