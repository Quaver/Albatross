import Logger from "../logging/Logger";
const Discord = require("discord.js");
const config = require("../config/config.json");

export default class DiscordWebhookHelper {
    /**
     * The webhook used to send messages to Discord.
     */
    public static Hook: any = null;

    /**
     * Initializes the discord webhook
     * @constructor
     */
    public static async Initialize(): Promise<void> {
        DiscordWebhookHelper.Hook = new Discord.WebhookClient(config.discord.webhook.id, config.discord.webhook.token);
        Logger.Success(`Discord Webhook has been successfully initialized!`);
    }
}