import Packet from "../Packet";
import PacketId from "../PacketId";
import ChatChannel from "../../chat/ChatChannel";
import { JsonObject, JsonProperty } from "json2typescript";
import UserGroups from "../../enums/UserGroups";

@JsonObject("ServerPacketAvailableChatchannel")
export default class ServerPacketAvailableChatchannel extends Packet {

    public Id: PacketId = PacketId.ServerAvailableChatChannel;
    
    @JsonProperty("n")
    public ChannelName: string;

    @JsonProperty("d")
    public ChannelDescription: string;

    @JsonProperty("ug")
    public AllowedUserGroups: UserGroups;

    constructor(chan: ChatChannel) {
        super();

        this.ChannelName = chan.Name;
        this.ChannelDescription = chan.Description;
        this.AllowedUserGroups = chan.AllowedUserGroups;
    }
}