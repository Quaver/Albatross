import StringToChannelMap from "./maps/StringToChannelMap";
import ChatChannel from "./ChatChannel";
import Logger from "../logging/Logger";
import UserGroups from "../enums/UserGroups";
import User from "../sessions/User";
import Albatross from "../Albatross";
import ServerPacketAvailableChatchannel from "../packets/server/ServerPacketAvailableChatChannel";
import QuaverBot from "../bot/QuaverBot";
import ServerPacketChatMessage from "../packets/server/ServerPacketChatMessage";
import ServerPacketLeftChatChannel from "../packets/server/ServerPacketLeftChatChannel";
import ServerPacketMuteEndTime from "../packets/server/ServerPacketMuteEndTime";
const config = require("../config/config.json");

export default class ChatManager {
    /**
     * All of the currently available chat channels
     */
    public static Channels: StringToChannelMap = {};

    /**
     * Initializes all of the chat channels for the server.
     */
    public static Initialize(): void {
        for (let i = 0; i < config.chatChannels.length; i++) {
            const chan: any = config.chatChannels[i];
            
            const channel: ChatChannel = new ChatChannel(chan.name, chan.description, chan.allowedUserGroups, chan.isModerated, chan.autojoin);
            ChatManager.Channels[channel.Name] = channel;

            Logger.Info(`Chat Channel: ${channel.Name} [${UserGroups[channel.AllowedUserGroups]}] has been initialized!`);
        }
    }

    /**
     * Sends an available chat channel packet to a user
     * @param user 
     */
    public static async SendAvailableChannel(user: User, chan: ChatChannel): Promise<void> {
        if (ChatChannel.IsUserAllowed(chan, user))
            return Albatross.SendToUser(user, new ServerPacketAvailableChatchannel(chan));

        Logger.Warning(`Tried to send ${user.Username} (#${user.Id}) available channel: ${chan.Name}, but failed. (No permissions!)`);
    }

    /**
     * Sends a message to client(s) from a specific user
     * 
     * - Handles both public and private and the # in the "to" dictates if its a channel
     *   or a specific user they want to send the message to.
     * @param sender 
     * @param to 
     * @param message 
     */
    public static async SendMessage(sender: User, to: string, message: string): Promise<void> {
        if (!to)
            return Logger.Warning(`${sender.Username} (#${sender.Id}) tried to send a message with an empty receiver`);

        if (!message)
            return Logger.Warning(`${sender.Username} (#${sender.Id}) tried to send an empty message`);

        // The send is muted, but their client is allowing them to send messages.
        // Stop execution and make them aware that they are muted.
        if (sender.IsMuted()) {
            Logger.Warning(`${sender.Username} (#${sender.Id}) tried to send a message, but they are muted!`);
            return Albatross.SendToUser(sender, new ServerPacketMuteEndTime(sender, sender.MuteEndTime));     
        }

        sender.SpamRate++;

        // Check if the user is spamming and mute them.
        if (sender.SpamRate >= 10 && (!sender.IsAdmin() && !sender.IsBot())) {
            Logger.Warning(`${sender.Username} (#${sender.Id}) has sent ${sender.SpamRate} messages in a short amount of time. Auto-muting!`);
            return await sender.MuteForSpamming(to);
        }

        // Go through with sending the mesage
        if (to.startsWith("#"))
            await ChatManager.SendPublicChannelMessage(sender, to, message);
        else
            await ChatManager.SendPrivateMessage(sender, to, message);
    }

    /**
     * Sends a message to a public channel.
     * @param sender 
     * @param to 
     * @param message 
     */
    private static async SendPublicChannelMessage(sender: User, to: string, message: string): Promise<void> {
        // Check if the channel actually exists
        if (!ChatManager.Channels[to])
            return Logger.Warning(`${sender.Username} (#${sender.Id}) has tried to send a message to: ${to}, but it doesn't exist!`);

        const channel: ChatChannel = ChatManager.Channels[to];

        // Check if the user is actually in the channel (Note: We ignore the bot user, as we want it to be in every channel)
        if (!channel.UsersInChannel.includes(sender) && sender != QuaverBot.User)
            return Logger.Warning(`${sender.Username} (#${sender.Id}) has tried to send a message to: ${to}, but they aren't in the channel!`);

        // User is talking in a moderated channel, but they aren't an administrator.
        if (channel.IsModerated && (!sender.IsAdmin() && !sender.IsDeveloper() && sender != QuaverBot.User))
            return;

        Albatross.SendToUsers(channel.UsersInChannel, new ServerPacketChatMessage(sender, to, message));
        await QuaverBot.HandlePublicMessageCommands(sender, channel, message);
    }

    /**
     * Sends a private message to a user.
     * @param sender 
     * @param to 
     * @param message 
     */
    private static async SendPrivateMessage(sender: User, to: string, message: string): Promise<void> {
        const receiver: User = Albatross.Instance.OnlineUsers.GetUserByUsername(to);

        if (!receiver)
            return Logger.Warning(`${sender.Username} (#${sender.Id}) has tried to send a message to: ${to}, but they are offline`);

        // Handle bot messages.
        if (receiver == QuaverBot.User)
            return await QuaverBot.HandlePrivateMessageCommands(sender, receiver, message);

        Albatross.SendToUser(receiver, new ServerPacketChatMessage(sender, to, message));  
    }
}