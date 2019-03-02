import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ServerPacketFailedToJoinChannel")
export default class ServerPacketFailedToJoinChannel extends Packet {

    public Id: PacketId = PacketId.ServerFailedToJoinChannelPacket;

    @JsonProperty("c")
    public ChannelName: string

    constructor(chan: string) {
        super();
        this.ChannelName = chan;
    }
}