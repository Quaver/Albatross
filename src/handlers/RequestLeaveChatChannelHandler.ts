import ClientPacketRequestLeaveChatChannel from "../packets/client/ClientPacketRequestLeaveChatChannel";
import User from "./rooster/User";
import ChatChannel from "../chat/ChatChannel";
import ChatManager from "../chat/ChatManager";
import Logger from "../logging/Logger";

export default class RequestLeaveChatChannelHandler {
    /**
     * Handles when the user wants to join a new chat channel.
     * @param socket 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketRequestLeaveChatChannel) {
        console.log(user.Username + " wants to leave " + packet.ChannelName);
     
        const channel: ChatChannel = ChatManager.Channels[packet.ChannelName];
        await user.LeaveChatChannel(channel);        
    }
}