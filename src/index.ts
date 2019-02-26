import Albatross from "./Albatross";
import DiscordWebhookHelper from "./discord/DiscordWebhookHelper";
const config = require("./config/config.json");

export default class Program {
    /**
     * Main execution point
     * @constructor
     */
    public static async Main(): Promise<void> {
        try {
            await DiscordWebhookHelper.Initialize();
            await new Albatross(config.port).Start();
        } catch (err) {
            throw err;
        }
    }
}

Program.Main();