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
import MultiplayerGame from "../multiplayer/MultiplayerGame";
import ServerPacketMultiplayerGameInfo from "../packets/server/ServerPacketMultiplayerGameInfo";
import ServerPacketJoinGame from "../packets/server/ServerPacketJoinGame";
import Lobby from "../multiplayer/Lobby";
import MultiplayerGameType from "../multiplayer/MultiplayerGameType";
import JoinGameFailureReason from "../enums/JoinGameFailureReason";
import ServerPacketJoinedGameFailed from "../packets/server/ServerPacketJoinGameFailed";
import ServerPacketUserJoinedGame from "../packets/server/ServerPacketUserJoinedGame";
import ServerPacketUserLeftGame from "../packets/server/ServerPacketUserLeftGame";
import ServerPacketGameNoMap from "../packets/server/ServerPacketGameNoMap";
import ServerPacketGamePlayerHasMap from "../packets/server/ServerPacketGamePlayerHasMap";
import ServerPacketGameJudgements from "../packets/server/ServerPacketGameJudgements";
import ServerPacketAllPlayersLoaded from "../packets/server/ServerPacketAllPlayersLoaded";
import MultiplayerPlayerMods from "../multiplayer/MultiplayerPlayerMods";
import MultiplayerGameRuleset from "../multiplayer/MultiplayerGameRuleset";
import MultiplayerPlayerWins from "../multiplayer/MultiplayerPlayerWins";
import Judgement from "../enums/Judgement";

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
     * The current game that the user is in, if any.
     */
    public CurrentGame: MultiplayerGame | null = null;

    /**
     * If the user is a multiplayer bot or not
     */
    public IsMultiplayerBot: boolean = false;

    /**
     * @param token 
     * @param steamId 
     * @param username 
     * @param socket 
     */
    constructor(socket: any, userId: number, steamId: string, username: string, allowed: boolean, muteEndTime: number, country: string,
        privileges: Privileges, usergroups: UserGroups, avatarUrl: string, isMultiplayerBot: boolean = false) {
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
        this.IsMultiplayerBot = isMultiplayerBot;
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
                Albatross.SendToUser(this, new ServerPacketFailedToJoinChannel(chan.Name));  
                
            return;
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
     * Returns if the user is currently in a multiplayer game.
     */
    public IsInMultiplayerGame(): boolean {
        return this.CurrentGame != null;
    }

    /**
     * Sends the user information about a multiplayer game.
     * @param game 
     */
    public SendMultiplayerGameInfo(game: MultiplayerGame): void {
        Albatross.SendToUser(this, new ServerPacketMultiplayerGameInfo(game));
    }

    /**
     * Joins the player into a multiplayer match
     * @param game 
     */
    public async JoinMultiplayerGame(game: MultiplayerGame, password: string | null = null): Promise<void> {
        // Have the player leave their already existing match if they're in one.
        await this.LeaveMultiplayerGame();

        if (!game)
            return this.SendJoinGameFailurePacket(JoinGameFailureReason.MatchNoExists);

        // Check to see if the user is eligible to join the match (room slots, etc).
        if (game.IsFull())
            return this.SendJoinGameFailurePacket(JoinGameFailureReason.Full);
 
        if (game.HasPassword && game.Password != password && !game.PlayersInvited.includes(this))
            return this.SendJoinGameFailurePacket(JoinGameFailureReason.Password);

        // Remove the player from the lobby if they're currently in it.
        Lobby.RemoveUser(this);

        // Send packet to users already in the game, letting them know that a new player has joined.
        // send it BEFORE pushing the new player to the list, so we don't send an unnecessary packet to 
        // the user jining.
        Albatross.SendToUsers(game.Players, new ServerPacketUserJoinedGame(this));

        // Place the player into the game
        this.CurrentGame = game;
        game.Players.push(this);
        game.PlayerIds.push(this.Id);
        game.PlayerMods.push(new MultiplayerPlayerMods(this, "0"));
        
        if (!game.PlayerWins.find(x => x.Id == this.Id))
            game.PlayerWins.push(new MultiplayerPlayerWins(this));

        this.JoinChatChannel(ChatManager.Channels[`#multiplayer_${game.Id}`]);

        // Let the player know they've joined the game.
        Albatross.SendToUser(this, new ServerPacketJoinGame(game));

        // Place the user on a team
        if (game.Ruleset == MultiplayerGameRuleset.Team)
            game.PlaceUserOnUnbalancedTeam(this, false);

        // Let players in the lobby be aware of this change
        game.InformLobbyUsers();
    }

    /**
     * Leaves the current multiplayer game if in one.
     * @param game 
     */
    public async LeaveMultiplayerGame(): Promise<void> {
        // User isn't in a game, so there's no need to handle it.
        if (!this.CurrentGame)
            return;

        const game: MultiplayerGame = this.CurrentGame;
        
        if (game.InProgress && game.Ruleset == MultiplayerGameRuleset.Battle_Royale)
            game.EliminateBattleRoyalePlayer(this);

        _.remove(game.Players, this);
        _.remove(game.PlayersWithoutMap, this.Id);
        _.remove(game.PlayersGameStartedWith, this);
        _.remove(game.PlayersWithGameScreenLoaded, this);
        _.remove(game.PlayersSkipped, this);
        game.PlayerMods = game.PlayerMods.filter((x: MultiplayerPlayerMods) => x.Id != this.Id);
        game.PlayerIds = game.PlayerIds.filter((x: number) => x != this.Id);
        game.PlayersReady = game.PlayersReady.filter((x: number) => x != this.Id);
        game.RedTeamPlayers = game.RedTeamPlayers.filter(x => x != this.Id);
        game.BlueTeamPlayers = game.BlueTeamPlayers.filter(x => x != this.Id);
        this.LeaveChatChannel(ChatManager.Channels[`#multiplayer_${game.Id}`]);
        this.LeaveChatChannel(ChatManager.Channels[game.GetTeamChatChannelName()]);

        this.CurrentGame = null;

        // No more players, so the game should be disbanded.
        if (game.Players.length == 0) {
            // Autohost games should end automatically if there aren't any players in the match
            if (game.IsAutohost)
                return await game.End();

            // No players left in a non-autohost game, so delete it
            return await Lobby.DeleteGame(game);
        }

        
        // The current host of the game was us, so we'll need to find a new host.   
        if (game.Type == MultiplayerGameType.Friendly && game.Host == this)
            await game.ChangeHost(game.Players[0]);

        // Send a packet to users already in the game.
        Albatross.SendToUsers(game.Players, new ServerPacketUserLeftGame(this));   
        
        // Let players in the lobby be aware of this change
        game.InformLobbyUsers(); 
        await game.RemoveCachedPlayer(this);  
    }

    /**
     * Handles when this particular user doesn't have the map in a multiplayer match
     */
    public HandleNoMultiplayerGameMap(): void {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} stated they don't have a map, but they aren't in a game.`);
            
        const game: MultiplayerGame = this.CurrentGame;

        if (!game.PlayersWithoutMap.includes(this.Id))
            game.PlayersWithoutMap.push(this.Id);

        Albatross.SendToUsers(game.Players, new ServerPacketGameNoMap(this));
        game.InformLobbyUsers();
    }

    /**
     * HAndles when the client now has the selected multiplayer game's map.
     */
    public HandleNowHasMultiplayerGameMap(): void {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} stated they now have a map, but they aren't in a game.`);

        const game: MultiplayerGame = this.CurrentGame;

        game.PlayersWithoutMap = game.PlayersWithoutMap.filter(x => x != this.Id);
        
        Albatross.SendToUsers(game.Players, new ServerPacketGamePlayerHasMap(this));
        game.InformLobbyUsers();
    }

    /**
     * Handles when the client has finished playing their multiplayer game play session
     */
    public async FinishPlayingMultiplayerGame(): Promise<void> {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} stated they finished playing a multiplayer game, but they aren't in one!`);

        const game: MultiplayerGame = this.CurrentGame;

        if (!game.FinishedPlayers.includes(this))
            game.FinishedPlayers.push(this);

        if (game.FinishedPlayers.length == game.PlayersGameStartedWith.length)
            await game.End();
    }

    /**
     * Handles when the client gives us more multiplayer judgements
     */
    public async HandleMultiplayerJudgements(judgements: number[]): Promise<void> {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} gave us multiplayer judgements, but they aren't in one!`);

        const game: MultiplayerGame = this.CurrentGame;

        if (!game.InProgress)
            return Logger.Warning(`${this.ToNameIdString()} gave us multiplayer judgements, but the game is not in progress!`);

        const processor = game.PlayerScoreProcessors[this.Id];
        const judgementsBefore = processor.JudgementList.length;
       
        if (!processor.Multiplayer)
            return;

        const livesBefore = processor.Multiplayer.Lives;

        game.CalculateUserScore(this, judgements);

        // Eliminate player if they've lost all their lives
        if (game.Ruleset == MultiplayerGameRuleset.Battle_Royale && livesBefore > 0 && processor.Multiplayer.Lives == 0) 
            game.EliminateBattleRoyalePlayer(this);

        await game.CachePlayerCurrentScore(this);

        // BOTS
        for (let i = 0; i < game.Players.length; i++ ) {
            if (game.Players[i].IsMultiplayerBot) {
                let judgements: Judgement[] = [];

                for (let j = judgementsBefore; j < game.PlayerScoreProcessors[this.Id].JudgementList.length; j++)
                    judgements.push(game.PlayerScoreProcessors[game.Players[i].Id].JudgementList[j]);

                setTimeout(() => Albatross.SendToUser(this, new ServerPacketGameJudgements(game.Players[i], judgements)), 400);
                
            }
        }

        if (game.Ruleset == MultiplayerGameRuleset.Battle_Royale)
            await game.HandleBattleRoyaleScoring();

        Albatross.SendToUsers(game.PlayersGameStartedWith, new ServerPacketGameJudgements(this, judgements));
    }

    /**
     * When the user is ready and loaded to play a multiplayer game
     */
    public ReadyToPlayMultiplayerGame(): void {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} stated their game screen is loaded, but they aren't in a multiplayer game!`);
        
        const game: MultiplayerGame = this.CurrentGame;

        if (!game.InProgress)
            return Logger.Warning(`${this.ToNameIdString()} stated their game screen is loaded, but the multiplayer game is not in progress`);

        if (game.PlayersWithGameScreenLoaded.includes(this))
            return Logger.Warning(`${this.ToNameIdString()} stated their game screen is loaded, but they are already loaded!`);

        game.PlayersWithGameScreenLoaded.push(this);

        for (let i = 0; i < game.PlayersGameStartedWith.length; i++) {
            if (!game.PlayersWithGameScreenLoaded.includes(game.PlayersGameStartedWith[i]))
                return;
        }

        Albatross.SendToUsers(game.PlayersGameStartedWith, new ServerPacketAllPlayersLoaded());
    }

    /**
     * Handles when the user is requesting to skip the song in a multiplayer game
     */
    public HandleMultiplayerGameSkipRequest(): void {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} requested to skip, but they aren't in a multiplayer game.`);

        const game: MultiplayerGame = this.CurrentGame;

        if (game.MatchSkipped)
            return Logger.Warning(`${this.ToNameIdString()} requested to skip, but the multiplayer game was already skipped.`);

        if (!game.InProgress)
            return Logger.Warning(`${this.ToNameIdString()} requested to skip, but the multiplayer game is not in progress.`);

        if (game.PlayersSkipped.includes(this))
            return Logger.Warning(`${this.ToNameIdString()} requested to skip, but they have already done so!`);

        game.PlayersSkipped.push(this);

        for (let i = 0; i < game.PlayersGameStartedWith.length; i++) { 
            if (!game.PlayersSkipped.includes(game.PlayersGameStartedWith[i]))
                return;
        }

        game.HandleAllPlayersSkipped();
    }

    /**
     * Handles when the user is ready in their multiplayer game.
     */
    public async HandleMultiplayerGameReady(): Promise<void> {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} said they were ready, but they aren't in a multiplayer game.`);

        const game: MultiplayerGame = this.CurrentGame;

        if (game.InProgress)
            return Logger.Warning(`${this.ToNameIdString()} said they were ready, but the game is already in progress.`);

        if (game.PlayersReady.includes(this.Id))
            return Logger.Warning(`${this.ToNameIdString()} said they were ready, but they are already ready.`);

        game.PlayersReady.push(this.Id);
        await game.InformPlayerIsReady(this);
        await game.HandleAutohostPlayerActionReady();
    }

    /**
     * Handles when the user is not ready in their multiplayer game
     */
    public async HandleMultiplayerGameNotReady(): Promise<void> {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} said they were not ready, but they aren't in a multiplayer game.`);

        const game: MultiplayerGame = this.CurrentGame;

        if (game.InProgress)
            return Logger.Warning(`${this.ToNameIdString()} said they were not ready, but the game is already in progress.`);

        if (!game.PlayersReady.includes(this.Id))
            return Logger.Warning(`${this.ToNameIdString()} said they were ready, but they aren't even ready`);

        game.PlayersReady = game.PlayersReady.filter((x: number) => x != this.Id);
        await game.InformPlayerNotReady(this);
    }

    /**
     * Handles starting the multiplayer game countdown start (if host)
     */
    public async HandleMultiplayerCountdownStart(): Promise<void> {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} said they want to start the match countdown, but they aren't in a multiplayer game.`);

        const game: MultiplayerGame = this.CurrentGame;

        if (game.Host != this)
            return Logger.Warning(`${this.ToNameIdString()} said they want to start the match countdown, but they aren't host!`);

        if (game.InProgress)
            return Logger.Warning(`${this.ToNameIdString()} said they want to start the match countdown, but the game is already in progress.`);

        await game.StartMatchCountdown();
    }

    /**
     * Handles stopping the multiplayer game countdown.
     */
    public async HandleMultiplayerCountdownStop(): Promise<void> {
        if (!this.CurrentGame)
            return Logger.Warning(`${this.ToNameIdString()} said they want to stop the match countdown, but they aren't in a multiplayer game.`);

        const game: MultiplayerGame = this.CurrentGame;

        if (game.Host != this)
            return Logger.Warning(`${this.ToNameIdString()} said they want to stop the match countdown, but they aren't host!`);

        if (game.CountdownStartTime == -1)
            return Logger.Warning(`${this.ToNameIdString()} said they want to stop the match countdown, but the countdown isn't active!`);

        await game.StopMatchCountdown();
    }

    /**
     * Sends a packet to the user stating that they are unable to join a game
     * for a specified reason
     * @param reason 
     */
    public SendJoinGameFailurePacket(reason: JoinGameFailureReason): void {
        Albatross.SendToUser(this, new ServerPacketJoinedGameFailed(reason));
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

    public ToNameIdString(): string {
        return `${this.Username} (#${this.Id})`;
    }
}