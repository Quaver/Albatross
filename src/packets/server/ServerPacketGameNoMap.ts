import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";

@JsonObject("ServerPacketGameNoMap")
export default class ServerPacketGameNoMap extends Packet {
    public Id: PacketId = PacketId.ServerGamePlayerNoMap;

    /**
     * The id of the user that doesn't have the map
     */
    @JsonProperty("uid")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}