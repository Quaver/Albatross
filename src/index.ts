import Albatross from "./Albatross";
import DiscordWebhookHelper from "./discord/DiscordWebhookHelper";
import SqlDatabase from "./database/SqlDatabase";
import SteamWebAPI from "./steam/SteamWebAPI";
import RedisHelper from "./database/RedisHelper";
import Azure from "./utils/Azure";
import CLI from "./utils/CLI";
import Logger from "./logging/Logger";
const config = require("./config/config.json");

export default class Program {
    /**
     * Main execution point
     * @constructor
     */
    public static async Main(): Promise<void> {
        try {
            await Program.CompileQuaverTools();
            Azure.Initialize(config.azure.connectionString);
            await RedisHelper.Initialize(config.databaseRedis);
            await SqlDatabase.Initialize(config.databaseSql.host, config.databaseSql.user, config.databaseSql.password, config.databaseSql.database, 10);
            await SteamWebAPI.Initialize();
            await DiscordWebhookHelper.Initialize();
            await new Albatross(config.port).Start();
        } catch (err) {
            throw err;
        }
    }

    /**
     * Compiles Quaver.Tools so we can use it throughout the server
     */
    private static async CompileQuaverTools(): Promise<void>{
        Logger.Info("Compiling Quaver.Tools before starting...");
            
        // Compile Quaver.API.Tests, so we can use this for difficulty calculation.
        const output = await CLI.RunAndGetOutput("dotnet build --configuration Release ../Quaver.API/Quaver.Tools");
        
        if (output.stderr != "")
            throw Error(output.stderr);

        Logger.Success(`Quaver.Tools has been successfully compiled!`);
    }
}

Program.Main();