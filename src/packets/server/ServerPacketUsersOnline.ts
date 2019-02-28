import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ServerPacketUsersOnline")
export default class ServerPacketUsersOnline extends Packet {

    public Id: PacketId = PacketId.ServerUsersOnline;

    @JsonProperty("u")
    public UserIds: number[];

    constructor(userIds: number[]) {
        super();
        
        this.UserIds = userIds;
    }
}