import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketGameStartCountdown")
export default class ServerPacketGameStartCountdown extends Packet {
    public Id: PacketId = PacketId.ServerGameStartCountdown;

    @JsonProperty("t")
    public Time: number;

    constructor(time: number) {
        super();
        this.Time = time;
    }
}