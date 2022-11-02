import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../handlers/rooster/User";

@JsonObject("ServerPacketUserLeftGame")
export default class ServerPacketUserLeftGame extends Packet {
    
    public Id: PacketId = PacketId.ServerUserLeftGame;

    @JsonProperty("uid")
    public UserId: number;

    constructor(user: User) {
        super();
        
        this.UserId = user.Id;
    }
}