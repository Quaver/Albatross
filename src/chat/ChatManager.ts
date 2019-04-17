import StringToChannelMap from "./maps/StringToChannelMap";
import ChatChannel from "./ChatChannel";
import Logger from "../logging/Logger";
import UserGroups from "../enums/UserGroups";
import User from "../sessions/User";
import Albatross from "../Albatross";
import ServerPacketAvailableChatchannel from "../packets/server/ServerPacketAvailableChatChannel";
import Bot from "../bot/Bot";
import ServerPacketChatMessage from "../packets/server/ServerPacketChatMessage";
import ServerPacketLeftChatChannel from "../packets/server/ServerPacketLeftChatChannel";
import ServerPacketMuteEndTime from "../packets/server/ServerPacketMuteEndTime";
import * as Discord from "discord.js";
import DiscordWebhookHelper from "../discord/DiscordWebhookHelper";
const config = require("../config/config.json");
const randomcolor = require("randomcolor");

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
            
            let webhook: Discord.WebhookClient | null = null;

            if (chan.discordWebhook && chan.discordWebhook.id && chan.discordWebhook.token) {
                webhook = new Discord.WebhookClient(chan.discordWebhook.id, chan.discordWebhook.token);
                webhook.client.listenerCount = function(){return 0};
            }
                
            const channel: ChatChannel = new ChatChannel(chan.name, chan.description, chan.allowedUserGroups, chan.isModerated, chan.autojoin, webhook);
            ChatManager.Channels[channel.Name] = channel;

            Logger.Info(`Chat Channel: ${channel.Name} [${UserGroups[channel.AllowedUserGroups]}] (WH: ${webhook != null}) has been initialized!`);
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
        if (!channel.UsersInChannel.includes(sender) && sender != Bot.User)
            return Logger.Warning(`${sender.Username} (#${sender.Id}) has tried to send a message to: ${to}, but they aren't in the channel!`);

        // User is talking in a moderated channel, but they aren't an administrator.
        if (channel.IsModerated && (!sender.IsAdmin() && !sender.IsDeveloper() && sender != Bot.User))
            return;

        // Send messages only to the players on the team that the user is on
        if (channel.Name.startsWith("#multi_team")) {
            if (!sender.CurrentGame)
                return Logger.Warning(`${sender.ToNameIdString()} sent message to team channel: ${channel.Name}, but they aren't in a game.`);

                Albatross.SendToUsers(sender.CurrentGame.GetUsersInTeam(sender.CurrentGame.GetUserTeam(sender)), 
                    new ServerPacketChatMessage(sender, to, message));
        }
        else
            Albatross.SendToUsers(channel.UsersInChannel, new ServerPacketChatMessage(sender, to, message));

        await Bot.HandlePublicMessageCommands(sender, channel, message);
        await ChatManager.LogPublicMessageToDiscord(sender, channel, message);
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
        if (receiver == Bot.User) {
            await Bot.HandlePrivateMessageCommands(sender, receiver, message);
            return await ChatManager.LogPrivateMessageToDiscord(sender, receiver, message);
        }

        Albatross.SendToUser(receiver, new ServerPacketChatMessage(sender, to, message));  
        await ChatManager.LogPrivateMessageToDiscord(sender, receiver, message);
    }

    /**
     * Sends a log to discord of public messages
     * @param sender 
     * @param channel 
     * @param message 
     */
    private static async LogPublicMessageToDiscord(sender: User, channel: ChatChannel, message: string): Promise<void> {
        if (!channel.DiscordWebhook)
            return;

        try {
            const embed = new Discord.RichEmbed()
            .setAuthor(sender.Username, sender.AvatarUrl, `https://quavergame.com/profile/${sender.Id}`)
            .setDescription(message)
            .setTimestamp()
            .setColor(randomcolor());

            await channel.DiscordWebhook.send(embed);
        } catch (err) {
            Logger.Error(err);
        }
    }

    /**
     * Sends log to discord of private messages.
     * @param sender 
     * @param to 
     * @param message 
     */
    private static async LogPrivateMessageToDiscord(sender: User, receiver: User, message: string): Promise<void> {
        if (!DiscordWebhookHelper.PrivateMessageHook)
            return;

        try {
            const embed = new Discord.RichEmbed()
            .setAuthor(sender.Username, sender.AvatarUrl, `https://quavergame.com/profile/${sender.Id}`)
            .setDescription(`**@${receiver.Username}:** ` + message)
            .setTimestamp()
            .setColor(randomcolor());

            await DiscordWebhookHelper.PrivateMessageHook.send(embed);
        } catch (err) {
            Logger.Error(err);
        }
    }
}