import Logger from "../logging/Logger";
import Albatross from "../Albatross";
import ServerPacketUserDisconected from "../packets/server/ServerPacketUserDisconnected";
import User from "./rooster/User";
import * as Discord from "discord.js";
import DiscordWebhookHelper from "../discord/DiscordWebhookHelper";

export default class CloseHandler {
    /**
     * Handles when sockets close the connection from the server
     * @param socket
     * @constructor
     */
    public static async Handle(socket: any): Promise<void> {
        try {
            const user: User = Albatross.Instance.OnlineUsers.GetUserBySocket(socket);
            
            if (!user)
                return;

            await user.DisconnectUserSession();
        } catch (err) {
            Logger.Error(err);
        }
    }

    /**
     * Sends the disconnection event for this user to Discord.
     * @param user 
     */
    public static async SendDisconnectionEventToDiscord(user: User): Promise<void> {
        if (!DiscordWebhookHelper.EventsHook)
            return;
        
        try {
            const embed = new Discord.RichEmbed()
            .setAuthor(user.Username, user.AvatarUrl, `https://quavergame.com/profile/${user.Id}`)
            .setDescription("Disconnected from the in-game server.\n")
            .setTimestamp()
            .setColor(0xff1010);

            DiscordWebhookHelper.EventsHook.send(embed)
        } catch (err) {
            Logger.Error(err);
        }
    }
}