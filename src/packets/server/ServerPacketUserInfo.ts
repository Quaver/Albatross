import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketUserInfo")
export default class ServerPacketUserInfo extends Packet {

    public Id: PacketId = PacketId.ServerUserInfo;

    @JsonProperty("u")
    public Users: object[];

    constructor(users: object[]) {
        super();
        
        this.Users = users;
    }
}