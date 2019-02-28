import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ServerPacketUserDisconnected")
export default class ServerPacketUserDisconected extends Packet {
    
    public Id: PacketId = PacketId.ServerUserDisconnected;

    @JsonProperty("u")
    public UserId: number;

    constructor(userId: number) {
        super();
        
        this.UserId = userId;
    }
}