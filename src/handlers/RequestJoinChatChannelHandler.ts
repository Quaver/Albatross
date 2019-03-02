import User from "../sessions/User";
import ClientPacketRequestJoinChatChannel from "../packets/client/ClientPacketRequestJoinChatChannel";
import ChatChannel from "../chat/ChatChannel";
import ChatManager from "../chat/ChatManager";

export default class RequestJoinChatChannelHandler {
    /**
     * Handle when a user wants to join a chat channel.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketRequestJoinChatChannel): Promise<void> {
        const channel: ChatChannel = ChatManager.Channels[packet.ChannelName];
        await user.JoinChatChannel(channel, true);
    }
}