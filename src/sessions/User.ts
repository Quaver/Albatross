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
import * as _ from "lodash";
import ServerPacketLeftChatChannel from "../packets/server/ServerPacketLeftChatChannel";
import ServerPacketFailedToJoinChannel from "../packets/server/ServerPacketFailedToJoinChannel";
import ServerPacketMuteEndTime from "../packets/server/ServerPacketMuteEndTime";
import OnlineNotificationType from "../enums/OnlineNotificationType";
import ChatManager from "../chat/ChatManager";
import Bot from "../bot/Bot";
import ServerPacketPing from "../packets/server/ServerPacketPing";
import UserClientStatus from "../objects/UserClientStatus";
import AdminActionLogger from "../admin/AdminActionLogger";
import AdminActionLogType from "../admin/AdminActionLogType";

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
    public SteamId: string;

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
     *  What the user is currently doing in-game.
     */
    public CurrentStatus: UserClientStatus = new UserClientStatus();

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
    constructor(socket: any, userId: number, steamId: string, username: string, allowed: boolean, muteEndTime: number, country: string,
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
     * Pings the client and updates their last ping time
     */
    public Ping(): void {
        this.LastPingTime = Date.now();
        Albatross.SendToUser(this, new ServerPacketPing());
    }

    /**
     * Kicks the user from the server
     */
    public async Kick(notify: boolean = true): Promise<void> {
        if (notify)
            Albatross.SendToUser(this, new ServerPacketNotification(ServerNotificationType.Error, "You have been kicked from the server."));

        return await AsyncHelper.Sleep(50, () => this.Socket.close());
    }

    /**
     * Bans the user from the game
     * 
     * TODO: Add Steam publisher banning.
     * @param notify 
     */
    public async Ban(notify: boolean = true): Promise<void> {
        // Change allowed status in the DB
        await SqlDatabase.Execute("UPDATE users SET allowed = 0 WHERE id = ?", [this.Id]);

        if (notify)
            Albatross.SendToUser(this, new ServerPacketNotification(ServerNotificationType.Error, "You have been banned from Quaver."));

        return await AsyncHelper.Sleep(50, () => this.Socket.close());
    }

    /**
     * Places the user in a chat channel if they aren't already in it.
     */
    public async JoinChatChannel(chan: ChatChannel, sendFailurePacket: boolean = false): Promise<void> {
        if (!chan)
            return Logger.Warning(`${this.Username} (#${this.Id}) has tried to join channel, but it does not exist!`);

        if (!ChatChannel.IsUserAllowed(chan, this)) {
            Logger.Warning(`${this.Username} (#${this.Id}) has tried to join channel: ${chan.Name}, but they do not have permission.`);

            if (sendFailurePacket)
                return Albatross.SendToUser(this, new ServerPacketFailedToJoinChannel(chan.Name));       
        }

        // User is already in the channel.
        if (this.ChannelsJoined.includes(chan))
            return;

        chan.UsersInChannel.push(this);
        this.ChannelsJoined.push(chan);
        
        Albatross.SendToUser(this, new ServerPacketJoinedChatChannel(chan));
    }

    /**
     * Removes the user from a chat channel that they're in
     * @param channel 
     */
    public LeaveChatChannel(channel: ChatChannel): void {
        // Check to see if the channel they want to leave actually exists
        if (!channel)
            return Logger.Warning(`${this.Username} (#${this.Id}) wants to leave a channel, but it doesn't exist!`);
            
        // Check to see if the user is actually in the channel.
        if (!channel.UsersInChannel.includes(this))
            return Logger.Warning(`${this.Username} (#${this.Id}) wants to leave channel '${channel.Name}', but they aren't in the channel!`);

        _.remove(channel.UsersInChannel, (u) => u == this);
        _.remove(this.ChannelsJoined, (c) => c == channel);

        // Send packet to user letting them know they've successfully left the channel.
        // this isn't really required, but if the server wants to force them to leave a channel, then 
        // thats a circumstance where the packet should be sent.
        Albatross.SendToUser(this, new ServerPacketLeftChatChannel(channel.Name));
    }

    /**
     * Mutes an online user for a specific amount of seconds
     * @param seconds 
     * @param reason 
     * @param author 
     */
    public async Mute(seconds: number, reason: string, author: number = 0): Promise<void> {
        this.MuteEndTime = Date.now() + (seconds * 1000);  
        
        Albatross.Broadcast(new ServerPacketMuteEndTime(this, this.MuteEndTime));

        await ChatManager.SendMessage(Bot.User, this.Username, `Your account has been muted for ${seconds} seconds.`);

        await SqlDatabase.Execute("UPDATE users SET mute_endtime = ? WHERE id = ?", [this.MuteEndTime, this.Id]);

        await SqlDatabase.Execute("INSERT INTO mutes (user_id, author, seconds, reason, timestamp) VALUES (?, ?, ?, ?, ?)",
            [this.Id, author, seconds, reason, Date.now()]);

        await SqlDatabase.Execute("INSERT INTO notifications (user_id, type, target_id, subject, message, timestamp) VALUES (?, ?, ?, ?, ?, ?)",
            [this.Id, Number(OnlineNotificationType.UserMuted), this.Id, "Your account has been muted.", 
            `Your account has been muted for ${seconds} seconds. During this time, you will not be able to use th in-game chat, ` + 
            `and some community features may be limited.`, Date.now()]);
    }

    /**
     * If this user is deemed to be spamming in chat, then this will mute them for the appropriate amount of time.
     */
    public async MuteForSpamming(channel: string): Promise<void> {
        const halfHour: number = 1800;
        await this.Mute(halfHour, `Spamming ${channel}`, Bot.User.Id);
        
        await AdminActionLogger.Add(Bot.User, this, AdminActionLogType.Updated, `Muted automatically for ${halfHour} seconds (Spamming)`);
    }

    /**
     * Unmutes a user
     */
    public async Unmute(): Promise<void> {
        this.MuteEndTime = 0;
        
        await SqlDatabase.Execute("UPDATE users SET mute_endtime = 0 WHERE id = ?", [this.Id]);
        
        Albatross.Broadcast(new ServerPacketMuteEndTime(this, this.MuteEndTime));
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
     * Returns if the user has a certain privilege
     * @param privilege 
     */
    public HasPrivilege(privilege: Privileges): boolean {
        return (this.Privileges & privilege) != 0;
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