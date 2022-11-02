import Packet from "../Packet";
import { JsonProperty, JsonObject } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../handlers/rooster/User";

@JsonObject("ServerPacketFellowListenerJoined")
export default class ServerPacketListeningPartyFellowJoined extends Packet {
    public Id: PacketId = PacketId.ServerListeningPartyFellowJoined;

    @JsonProperty("u")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}