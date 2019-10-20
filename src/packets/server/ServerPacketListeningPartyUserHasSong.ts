import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";

@JsonObject("ServerPacketListeningPartyUserHasSong")
export default class ServerPacketListeningPartyUserHasSong extends Packet {
    public Id: PacketId = PacketId.ServerListeningPartyUserHasSong;

    @JsonProperty("u")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}