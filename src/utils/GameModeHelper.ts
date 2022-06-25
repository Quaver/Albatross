import GameMode from "../enums/GameMode";

export default class GameModeHelper {
    /**
     * Returns a game mode enum value from its short string.
     * @param str 
     */
    public static GetGameModeFromShortString(str: string): GameMode | undefined {
        switch (str.toLowerCase()) {
            case "4k":
                return GameMode.Keys4;
            case "7k":
                return GameMode.Keys7;
            default:
                return undefined;
        }
    }

    public static GetShortStringFromMode(mode: GameMode): string {
        switch (mode) {
            case GameMode.Keys4:
                return "4K";
            case GameMode.Keys7:
                return "7K";
            default:
                return "None";
        }
    }
}