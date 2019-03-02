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
import Albatross from "../Albatross";
import ChatChannel from "../chat/ChatChannel";
import Logger from "../logging/Logger";
import ServerPacketJoinedChatChannel from "../packets/server/ServerPacketJoinedChatChannel";

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
     * The channels that the user has currently joined.
     */
    public ChannelsJoined: ChatChannel[] = [];

    /**
     * The amount of messages the user has sent within the spam detection interval.
     */
    public SpamRate: number = 0;

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
            Albatross.SendToUser(this, new ServerPacketNotification(ServerNotificationType.Error, "You have been kicked from the server."));

        return await AsyncHelper.Sleep(100, () => this.Socket.close());
    }

    /**
     * Places the user in a chat channel if they aren't already in it.
     */
    public async JoinChatChannel(chan: ChatChannel): Promise<void> {
        if (!ChatChannel.IsUserAllowed(chan, this)) {
            Logger.Warning(`${this.Username} (#${this.Id}) has tried to join channel: ${chan.Name}, but they do not have permission`);
            return;
        }

        if (this.ChannelsJoined.includes(chan)) {
            Logger.Warning(`${this.Username} (#${this.Id}) has tried to join channel: ${chan.Name}, but they are already in it.`);
            return;
        }

        chan.UsersInChannel.push(this);
        this.ChannelsJoined.push(chan);
        
        Albatross.SendToUser(this, new ServerPacketJoinedChatChannel(chan));
    }

    /**
     * Returns if the user is muted in chat.
     */
    public IsMuted(): boolean { 
        return this.MuteEndTime > Date.now();
    }

    /**
     * Returns if the user is an administrator
     */
    public IsAdmin(): boolean {
        return (this.UserGroups & UserGroups.Admin) != 0;
    }

    /**
     * Returns if the user is a bot
     */
    public IsBot(): boolean {
        return (this.UserGroups & UserGroups.Bot) != 0;
    }

    /**
     * Returns if the user is a developer
     */
    public IsDeveloper(): boolean {
        return (this.UserGroups & UserGroups.Developer) != 0;
    }

    /**
     * Returns if the user is a moderator
     */
    public IsModerator(): boolean {
        return (this.UserGroups & UserGroups.Moderator) != 0;
    }

    /**
     * Returns if the user is god.
     */
    public IsSwan(): boolean {
        return (this.UserGroups & UserGroups.Swan) != 0;
    }

    /**
     * Returns if the user is a ranking supervisor
     */
    public IsRankingSupervisor(): boolean {
        return (this.UserGroups & UserGroups.RankingSupervisor) != 0;
    }

    /**
     * Returns if the user is a contributor
     */
    public IsContributor(): boolean {
        return (this.UserGroups & UserGroups.Contributor) != 0;
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