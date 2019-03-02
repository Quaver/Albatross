import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ClientPacketRequestLeaveChatChannel")
export default class ClientPacketRequestLeaveChatChannel extends Packet {

    public Id: PacketId = PacketId.ClientRequestLeaveChatChannel;

    @JsonProperty("c")
    public ChannelName: string = "";
}