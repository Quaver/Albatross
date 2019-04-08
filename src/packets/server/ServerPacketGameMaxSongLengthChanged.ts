import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketGameMaxSongLengthChanged")
export default class ServerPacketGameMaxSongLengthChanged extends Packet {
    public Id: PacketId = PacketId.ServerGameMaxSongLengthChanged;

    @JsonProperty("s")
    public Seconds: number;

    constructor(seconds: number) {
        super();
        this.Seconds = seconds;
    }
}