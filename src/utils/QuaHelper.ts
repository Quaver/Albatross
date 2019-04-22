import ModIdentifiers from "../enums/ModIdentifiers";
import CLI from "./CLI";
import Logger from "../logging/Logger";

export default class QuaHelper {
    /**
     * Runs the difficulty calculator program on a given path (Quaver.API.Test)
     * @constructor
     */
    public static async RunDifficultyCalculator(path: string, mods: ModIdentifiers): Promise<any> {
        try {
            const result: any = await CLI.RunAndGetOutput("dotnet ../Quaver.API/Quaver.Tools/bin/Release/netcoreapp2.0/" +
                "Quaver.Tools.dll -calcdiff " + path + " " + mods);
            
            if (result.stderr != "") {
                Logger.Error(result.stderr);
                return null;
            } 
            
            return JSON.parse(result.data);
        } catch (err) {
            Logger.Error(err);
            return null;
        }
    }
}