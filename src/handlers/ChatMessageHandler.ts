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
    public static async Handle(user: User, packet: ClientPacketChatMessage): Promise<void> {
        try {
                        
            // Prevent flooding the chat.
            if (packet.Message.length > 2000 || packet.Message.length == 0)
                return Logger.Warning(`${user.Username} (#${user.Id}) has sent a message, but it isn't within the character limit!`);

            ChatManager.SendMessage(user, packet.To, packet.Message);
        } catch (err) {
            Logger.Error(err);
        }
    }
}