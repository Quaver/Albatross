import StringToChannelMap from "./maps/StringToChannelMap";
import ChatChannel from "./ChatChannel";
import Logger from "../logging/Logger";
import UserGroups from "../enums/UserGroups";
import User from "../sessions/User";
import Albatross from "../Albatross";
import ServerPacketAvailableChatchannel from "../packets/server/ServerPacketAvailableChatChannel";
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
            return await Albatross.SendToUser(user, new ServerPacketAvailableChatchannel(chan));

        Logger.Warning(`Tried to send ${user.Username} (#${user.Id}) available channel: ${chan.Name}, but failed. (No permissions!)`);
    }
}