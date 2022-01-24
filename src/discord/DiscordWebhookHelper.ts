import Logger from "../logging/Logger";
import * as Discord from "discord.js";
const config = require("../config/config.json");

export default class DiscordWebhookHelper {
    /**
     * The webhook used to send messages to Discord.
     */
    public static EventsHook: Discord.WebhookClient | null = null;

    /**
     * Logs private messages 
     */
    public static PrivateMessageHook: Discord.WebhookClient | null = null;

    /**
     * Logs multiplayer chat channel messages
     */
    public static MultiplayerMessageHook: Discord.WebhookClient | null = null;

    /**
     * Anti-cheat Logs
     */
    public static AnticheatWebhook: Discord.WebhookClient | null = null;

    /**
     * Initializes the discord webhook
     * @constructor
     */
    public static async Initialize(): Promise<void> {
        try {
            if (config.discord.eventsWebhook) {
                DiscordWebhookHelper.EventsHook = new Discord.WebhookClient(config.discord.eventsWebhook.id, config.discord.eventsWebhook.token);
                DiscordWebhookHelper.EventsHook.client.listenerCount = function(){return 0};
            }
        } catch (err) {
            Logger.Error(err);
        }

        try {
            if (config.discord.privateMessageWebhook) {
                DiscordWebhookHelper.PrivateMessageHook = new Discord.WebhookClient(config.discord.privateMessageWebhook.id, 
                    config.discord.privateMessageWebhook.token);
    
                DiscordWebhookHelper.PrivateMessageHook.client.listenerCount = function(){return 0};
            }
        } catch (err) {
            Logger.Error(err);
        }


        try {
            if (config.discord.multiplayerMessageHook) {
                DiscordWebhookHelper.MultiplayerMessageHook = new Discord.WebhookClient(config.discord.multiplayerMessageWebhook.id, 
                    config.discord.multiplayerMessageWebhook.token);
    
                DiscordWebhookHelper.MultiplayerMessageHook.client.listenerCount = function(){return 0};
            }
        } catch (err) {
            Logger.Error(err);
        }

        try {
            if (config.discord.anticheatWebhook) {
                                DiscordWebhookHelper.AnticheatWebhook = new Discord.WebhookClient(config.discord.anticheatWebhook.id, 
                    config.discord.anticheatWebhook.token);
    
                DiscordWebhookHelper.AnticheatWebhook.client.listenerCount = function(){return 0};
            }
        } catch (err) {
            Logger.Error(err);
        }

        Logger.Success(`Discord Webhook has been successfully initialized!`);
    }
}