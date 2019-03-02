import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketRequestJoinChatChannel")
export default class ClientPacketRequestJoinChatChannel extends Packet {

    public Id: PacketId = PacketId.ClientRequestJoinChatChannel;

    @JsonProperty("c")
    public ChannelName: string = "";
}