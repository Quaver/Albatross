import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonProperty, JsonObject } from "json2typescript";

@JsonObject("ServerLeftChatChannelPacket")
export default class ServerPacketLeftChatChannel extends Packet {
    
    public Id: PacketId = PacketId.ServerLeftChatChannelPacket;

    @JsonProperty("c")
    public ChannelName: string = "";

    constructor(chan: string) {
        super();

        this.ChannelName = chan;
    }
}