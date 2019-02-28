import Logger from "../logging/Logger";
const steam = require("steam-web");
const config = require("../config/config.json");

export default class SteamWebAPI {
    /**
     * The Steam web API client object.
     */
    public static Client: any;
    
    /**
     * Initializes the Steam Web API Client.
     * @constructor
     */
    public static Initialize(): void {
        SteamWebAPI.Client = new steam({
            apiKey: config.steam.webApiKey,
            format: "json"
        });
        
        Logger.Success(`Successfully initialized SteamWebAPI client.`);
    }

    /**
     * Retrieves player summaries from given steam ids.
     * @param steamIds
     * @constructor
     */
    public static async GetPlayerSummaries(steamIds: string[]): Promise<any> {
        return new Promise((resolve, reject) => {
            SteamWebAPI.Client.getPlayerSummaries({
                steamids: steamIds,
                callback: (err: any,  data: any) => {
                    if (err)
                        return reject(err);
                    
                    return resolve(data.response.players)
                }
            })
        });
    }

    /**
     * 
     * @param steamId
     * @constructor
     */
    public static async GetUserAvatarLink(steamId: string) : Promise<string | null> {
        try {
            const resp: any = await SteamWebAPI.GetPlayerSummaries([steamId]);
            
            return resp[0].avatarfull;
        } catch (err) {
            return null;
        }
    }
}