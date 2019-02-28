import ClientPacketChatMessage from "../packets/client/ClientPacketChatMessage";
import Logger from "../logging/Logger";
import User from "../sessions/User";
import Albatross from "../Albatross";
import ChatManager from "../chat/ChatManager";

export default class ChatMessageHander { 
    /**
     * Handles when the client sends the server chat messages
     * @param socket 
     * @param packet 
     */
    public static async Handle(socket: any, packet: ClientPacketChatMessage): Promise<void> {
        try {
            const sender: User = Albatross.Instance.OnlineUsers.GetUserBySocket(socket);
            
            if (!sender)
                return Logger.Warning(`Socket: ${socket.token} has tried to send a message, but they went offline!`);
            
            // Prevent flooding the chat.
            if (packet.Message.length > 2000 || packet.Message.length == 0)
                return Logger.Warning(`${sender.Username} (#${sender.Id}) has sent a message, but it isn't within the character limit!`);

            ChatManager.SendMessage(sender, packet.To, packet.Message);
        } catch (err) {
            Logger.Error(err);
        }
    }
}