import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import ChatChannel from "../../chat/ChatChannel";

@JsonObject("ServerPacketJoinedChatChannel")
export default class ServerPacketJoinedChatChannel extends Packet {

    public Id: PacketId = PacketId.ServerJoinedChatChannel;

    @JsonProperty("c")
    public ChannelName: string;

    constructor(chan: ChatChannel) {
        super();
        
        this.ChannelName = chan.Name;
    }
}