import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import User from "../../handlers/rooster/User";

@JsonObject("ServerPacketMuteEndTime")
export default class ServerPacketMuteEndTime extends Packet {

    public Id: PacketId = PacketId.ServerMuteEndTimePacket;

    @JsonProperty("u")
    public UserId: number;

    @JsonProperty("t")
    public MuteEndTime: number;

    constructor(user: User, time: number) {
        super();

        this.UserId = user.Id;
        this.MuteEndTime = time;
    }
}