import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";

@JsonObject("ServerPacketGamePlayerChangeModifiers")
export default class ServerPacketGamePlayerChangeModifiers extends Packet {
    public Id: PacketId = PacketId.ServerGamePlayerChangeModifiers;

    @JsonProperty("u")
    public UserId: number;

    @JsonProperty("m")
    public Modifiers: string;

    constructor(user: User, mods: string) { 
        super();
        
        this.UserId = user.Id;
        this.Modifiers = mods;
    }
}