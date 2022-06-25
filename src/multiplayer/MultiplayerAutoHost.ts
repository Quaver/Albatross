import SqlDatabase from "../database/SqlDatabase";
import GameMode from "../enums/GameMode";
import MultiplayerGame from "./MultiplayerGame";

export default class MultiplayerAutoHost {
    private Game: MultiplayerGame;

    private GameMode: GameMode;

    private MinDifficulty: number;

    private MaxDifficulty: number;

    constructor(game: MultiplayerGame, gameMode: GameMode, minDiff: number, maxDiff: number) {
        this.Game = game;
        this.GameMode = gameMode;
        this.MinDifficulty = minDiff;
        this.MaxDifficulty = maxDiff;
    }

    public async SelectMap(): Promise<void> {
        const playlist = await this.FetchPlaylist();
        const map = playlist[Math.floor(Math.random() * playlist.length)];
        const mapStr = `${map.artist} - ${map.title} [${map.difficulty_name}]`;

        await this.Game.ChangeMap(map.md5, map.id, map.mapset_id, mapStr, map.game_mode, map.difficulty_rating, [],
             map.count_hitobject_normal + map.count_hitobject_long * 2, "", true);
    }

    private async FetchPlaylist(): Promise<any[]> {
        let maps = await SqlDatabase.Execute(
            "SELECT id, mapset_id, md5, game_mode, difficulty_rating, " + 
            "count_hitobject_normal, count_hitobject_long, artist, title, difficulty_name, length " + 
            "FROM maps WHERE difficulty_rating > ? AND difficulty_rating < ? " + 
            "AND ranked_status = 2", [this.MinDifficulty, this.MaxDifficulty]);

        const filtered = [];

        for (let i = 0; i < maps.length; i++) {
            const map = maps[i];

            if (map.game_mode != this.GameMode || map.length > 240000)
                continue;

            filtered.push(map);
        }

        return filtered;       
    }
}