import Albatross from "./Albatross";
import DiscordWebhookHelper from "./discord/DiscordWebhookHelper";
import SqlDatabase from "./database/SqlDatabase";
import SteamWebAPI from "./steam/SteamWebAPI";
import RedisHelper from "./database/RedisHelper";
const config = require("./config/config.json");

export default class Program {
    /**
     * Main execution point
     * @constructor
     */
    public static async Main(): Promise<void> {
        try {
            await RedisHelper.Initialize(config.databaseRedis);
            await SqlDatabase.Initialize(config.databaseSql.host, config.databaseSql.user, config.databaseSql.password, config.databaseSql.database, 10);
            await SteamWebAPI.Initialize();
            await DiscordWebhookHelper.Initialize();
            await new Albatross(config.port).Start();
        } catch (err) {
            throw err;
        }
    }
}

Program.Main();