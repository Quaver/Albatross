import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketUserStatus")
export default class ServerPacketUserStats extends Packet {
    public Id: PacketId = PacketId.ServerUserStats;

    @JsonProperty("u")
    public Users: object;

    constructor(userStats: any) {
        super();
        this.Users = userStats;
    }
}