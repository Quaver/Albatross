import * as fs from "fs-extra";
import FileHelper from "./FileHelper";
import Logger from "../logging/Logger";
import Azure from "./Azure";
const config = require("../config/config.json");

export default class MapsHelper {
    /**
     * Caches the map with the given id to the API to reuse it.
     * @constructor
     * @param map
     */
    public static async CacheMap(map: any): Promise<boolean> {
        await FileHelper.CreateDirectoryIfNotExists(config.api.dataFolderPath);
        await FileHelper.CreateDirectoryIfNotExists(`${config.api.dataFolderPath}/maps`);
        
        const path: string = `${config.api.dataFolderPath}/maps/${map.id}.qua`;
        let needToDownload: boolean = false;
        
        // Check if the file already exists
        if (fs.existsSync(path)) {
            // Check if the md5 of the file we already have matches.
            // if not, then we need to download it from Azure.
            if (await FileHelper.Md5File(path) != map.md5)
               needToDownload = true;
        } else {
            needToDownload = true;
        }
        
        // Download the map from azure.
        if (needToDownload) {
            Logger.Info(`Downloading new cached map: ${map.id} from Azure...`);
            
            try {
                 await Azure.DownloadBlob("maps", `${map.id}.qua`, path);
            } catch (err) {
                Logger.Error(err);
                return false;
            }
        }
        
        // Do a final md5 hash check.
        return await FileHelper.Md5File(path) == map.md5;
    }

    /**
     * Gets the full path of a cached map.
     * @param id
     * @constructor
     */
    public static GetCachedMapPath(id: number): string {
        return `${config.api.dataFolderPath}/maps/${id}.qua`;
    }
}