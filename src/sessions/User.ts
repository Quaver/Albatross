import IPacketWritable from "../packets/IPacketWritable";
import Privileges from "../enums/Privileges";
import UserGroups from "../enums/UserGroups";
import GameMode from "../enums/GameMode";
import SqlDatabase from "../database/SqlDatabase";
import UserStats from "./UserStats";
import ModeToUserStatsMap from "./ModeToUserStatsMap";
import RedisHelper from "../database/RedisHelper";
import ServerPacketNotification from "../packets/server/ServerPacketNotification";
import ServerNotificationType from "../enums/ServerNotificationType";
import AsyncHelper from "../utils/AsyncHelper";

export default class User implements IPacketWritable, IStringifyable {
    /**
     * The token that marks this user's session to the server
     */
    public Token: string | null;

    /**
     * The user's socket connection
     */
    public Socket: any;

    /**
     * The user's userid/
     */
    public Id: number;

    /**
     * The user's confirmed Steam Id
     */
    public SteamId: number;

    /**
     * The username of the user
     */
    public Username: string;

    /**
     * If the user is allowed to connect to the server
     */
    public Allowed: boolean;

    /**
     * The time the user's mute expires.
     */
    public MuteEndTime: number;

    /**
     * The country (code) the user is from
     */
    public Country: string;

    /**
     * The administrative privileges the user has
     */
    public Privileges: Privileges;

    /**
     * The usergroups the user is apart of.
     */
    public UserGroups: UserGroups;

    /**
     * The URL of the user's Steam avatar.
     */
    public AvatarUrl: string;

    /**
     *  Statistics for the user.
     */
    public Stats: ModeToUserStatsMap = {};

    /**
     * The time the client was last pinged
     */
    public LastPingTime: number = Date.now();

    /**
     * The last time we've received a pong from the client.
     */
    public LastPongTime: number = Date.now();

    /**
     * @param token 
     * @param steamId 
     * @param username 
     * @param socket 
     */
    constructor(socket: any, userId: number, steamId: number, username: string, allowed: boolean, muteEndTime: number, country: string,
        privileges: Privileges, usergroups: UserGroups, avatarUrl: string) {
        // For artifical users such as bots.
        if (socket)
            this.Token = socket.token;
        else
            this.Token = null;

        this.Socket = socket;
        this.Id = userId;
        this.SteamId = steamId;
        this.Username = username;
        this.Allowed = allowed;
        this.MuteEndTime = muteEndTime;
        this.Country = country;
        this.Privileges = privileges;
        this.UserGroups = usergroups;
        this.AvatarUrl = avatarUrl;
    }

    /**
     * Kicks the user from the server
     */
    public async Kick(notify: boolean = true): Promise<void> {
        if (notify)
            this.Socket.send(new ServerPacketNotification(ServerNotificationType.Error, "You have been kicked from the server.").ToString());

        return await AsyncHelper.Sleep(100, () => this.Socket.close());
    }

    /**
     * Updates the user's stats from the database
     */
    public async UpdateStats(): Promise<void> {
        for (let mode in GameMode) {
            if (isNaN(Number(mode)))
                continue;

            const gameMode: number = Number(mode);

            // Retrieve a stringified version of the mode thats a table in the DB.
            let modeTableName: string | null = null;

            switch (gameMode) {
                case GameMode.Keys4:
                    modeTableName = "keys4";
                    break;
                case GameMode.Keys7:
                    modeTableName = "keys7";
                    break;
                default:
                    throw new Error("GameMode string not implemented for User.UpdateStats()");
            }

            const stats = await SqlDatabase.Execute(`SELECT * FROM user_stats_${modeTableName} WHERE user_id = ? LIMIT 1`, [this.Id]);

            // This should never ever happen, but we'll handle it regardless.
            if (stats.length == 0)
                throw new Error(`Couldn't update ${modeTableName} stats for user: ${this.Username} (#${this.Id}). No stats found?`);

            // Get user leaderboard stats in Redis
            let globalRank: any = await RedisHelper.zrevrank(`quaver:leaderboard:${gameMode}`, this.Id.toString());

            if (globalRank == null)
                globalRank = -1;
            else
                globalRank = Number(globalRank) + 1

            let countryRank: any = await RedisHelper.zrevrank(`quaver:country_leaderboard:${this.Country.toLowerCase()}:${gameMode}`, this.Id.toString());

            if (countryRank == null)
                countryRank = -1;
            else
                countryRank = Number(countryRank) + 1;

            this.Stats[gameMode] = new UserStats(gameMode, globalRank, countryRank, stats[0].total_score, stats[0].ranked_score, stats[0].overall_accuracy,
                stats[0].overall_performance_rating, stats[0].play_count);
        }
    }

    public Serialize(): object {
        return {
            id: this.Id,
            sid: this.SteamId,
            u: this.Username,
            ug: Number(this.UserGroups),
            m: this.MuteEndTime,
            c: this.Country
        }
    }

    public ToString(): string {
        return JSON.stringify(this);
    }
}