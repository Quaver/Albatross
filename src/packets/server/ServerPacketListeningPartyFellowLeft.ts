import Packet from "../Packet";
import { JsonProperty, JsonObject } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";

@JsonObject("ServerPacketListeningPartyFellowJoined")
export default class ServerPacketListeningPartyFellowLeft extends Packet {
    public Id: PacketId = PacketId.ServerListeningPartyFellowLeft;

    @JsonProperty("u")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}