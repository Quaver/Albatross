import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import User from "../../sessions/User";

@JsonObject("ServerPacketGamePlayerHasMap")
export default class ServerPacketGamePlayerHasMap extends Packet {
    public Id: PacketId = PacketId.ServerGamePlayerHasMap;

    /**
     * The id of the user that has the map now
     */
    @JsonProperty("uid")
    public UserId: number;

    constructor(user: User) {
        super();
        this.UserId = user.Id;
    }
}