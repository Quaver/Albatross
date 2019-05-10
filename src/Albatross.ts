import Logger from "./logging/Logger";
import StringHelper from "./utils/StringHelper";
import LoginHandler from "./handlers/LoginHandler";
import PacketHandler from "./handlers/PacketHandler";
import CloseHandler from "./handlers/CloseHandler";
import ServerPacketPing from "./packets/server/ServerPacketPing";
import {setInterval} from "timers";
import OnlineUserStore from "./sessions/OnlineUserStore";
import Bot from "./bot/Bot";
import RedisHelper from "./database/RedisHelper";
import ServerPacketUsersOnline from "./packets/server/ServerPacketUsersOnline";
import Packet from "./packets/Packet";
import User from "./sessions/User";
import ChatManager from "./chat/ChatManager";
import PacketId from "./packets/PacketId";
import Lobby from "./multiplayer/Lobby";

const config = require("./config/config.json");
const express = require("express");
const WebSocketServer = require("uws").Server;

export default class Albatross {
    /**
     *  The current instance of Albatross
     */
    public static Instance: Albatross;
    
    /**
     * The port the server will run on
     */
    public Port: number;
    
    /**
     * Contains all of the users connected to the server.
     */
    public OnlineUsers: OnlineUserStore;

    /**
     * The websocket server itself
     */
    public Server: any;

    /**
     * How frequent users will be pinged by the server
     */
    private readonly PING_INTERVAL: number = 20000;

    /**
     * The time it takes for a user to be timed out for now responding to pings.
     */
    private readonly PING_TIMEOUT_TIME: number = 80000;

    /**
     * How frequent spam rates will be cleared for users
     */
    private readonly SPAM_RATE_CLEAR_INTERVAL: number = 10000;

    /**
     * The time user spam rates were last cleared.
     */
    private TimeSpamRateLastCleared: number = 0;

    /**
     * @param port
     */
    constructor(port: number) {
        this.Port = port;
        Albatross.Instance = this;
        ChatManager.Initialize();
        this.OnlineUsers = new OnlineUserStore();
    }
    
    /**
     * Starts the server
     * @constructor
     */
    public async Start(): Promise<void> {
        await this.CleanPreviousSessions();
        await this.CleanPreviousMultiplayerMatches();

        await Bot.Initialize();
        // await Lobby.CreateAutohostGames();
        
        this.StartBackgroundWorker();
        this.Server = new WebSocketServer({ port: this.Port });
        
        // Lobby.InitializeTest();
        
        this.Server.on("connection", async (socket: any) => {
            await LoginHandler.Handle(socket);
            socket.on("message", async (message: any) => await PacketHandler.Handle(socket, message));
            socket.on("close",async  () => await CloseHandler.Handle(socket));
        });
        
        this.Server.on("error", async (err: any) => {
            Logger.Error(err);
        });

        this.LogStart();
    }
    
    /**
     * Cleans previous user sessions in Redis
     */
    private async CleanPreviousSessions(): Promise<void> {
        await RedisHelper.set("quaver:server:online_users", "0");
        Logger.Success(`Successfully reset Redis online user count to 0.`);

        const sessionkeys = await RedisHelper.keys("quaver:server:session:*");

        for (let i = 0; i < sessionkeys.length; i++)
            await RedisHelper.del(sessionkeys[i]);
        
        Logger.Success(`Successfully deleted all previous ${sessionkeys.length} user session tokens from Redis!`);

        const statusKeys = await RedisHelper.keys("quaver:server:user_status:*");

        for (let i = 0; i < statusKeys.length; i++)
            await RedisHelper.del(statusKeys[i]);

        Logger.Success(`Successfully deleted all previous ${statusKeys.length} user status keys from Redis!`);
    }

    /**
     * Clears all the previous multiplayer matches from Redis
     */
    private async CleanPreviousMultiplayerMatches(): Promise<void> {
        await RedisHelper.set("quaver:server:multiplayer_matches", "0");
        Logger.Success(`Successfully set Redis multiplayer match count to 0.`);

        const multiplayerMatches = await RedisHelper.keys("quaver:server:multiplayer:*");

        for (let i = 0; i < multiplayerMatches.length; i++)
            await RedisHelper.del(multiplayerMatches[i]);

        Logger.Success(`Successfully deleted all previous ${multiplayerMatches.length} multiplayer matches from Redis!`);
    }

    /**
     * Broadcasts a packet to all online users.
     */
    public static Broadcast(packet: Packet): void {
        if (config.logPacketTransfer)
            Logger.Info(`Broadcasting Packet: ${PacketId[packet.Id]} -> "${packet.ToString()}"`);

        Albatross.Instance.Server.broadcast(packet.ToString());
    }

    /**
     * Sends a packet to a specific user
     */
    public static SendToUser(user: User, packet: Packet): void {
        if (!user.Socket)
            return;

        if (config.logPacketTransfer)
            Logger.Info(`Sending Packet: To ${user.Username} (#${user.Id}) -> ${PacketId[packet.Id]} -> "${packet.ToString()}"}`);
                       
        user.Socket.send(packet.ToString());
    }

    /**
     * Sends a packet to a list of users
     * @param users 
     * @param packet 
     */
    public static SendToUsers(users: User[], packet: Packet): void {
        for (let i = 0; i < users.length; i++)
            Albatross.SendToUser(users[i], packet);
    }

    /**
     * Sends a packet to a specific socket
     * @param socket 
     * @param packet 
     */
    public static SendToSocket(socket: any, packet: Packet): void {
        if (!socket)
            return;
            
        socket.send(packet.ToString());
    }

    /**
     * Builds a packet which contains the list of all online user ids
     */
    public static BuildUsersOnlinePacket(): ServerPacketUsersOnline {
        return new ServerPacketUsersOnline(Albatross.Instance.OnlineUsers.Users.map(x => x.Id));
    }

    /**
     * Starts a worker interval to perform certain tasks to keep the server in check.
     * Tasks include:
     * 
     * - Pinging users & timing out users who haven't responded to pongs
     * - Clearing chat spam rates
     */
    private StartBackgroundWorker(): void {
        // Initially set the spam rate clear time so it can be fresh with the current time.
        this.TimeSpamRateLastCleared = Date.now();

        setInterval(() => {
            // Fetch the current time, so it can be used to detect when certain actions
            // should be performed during this interval
            const currentTime: number = Date.now();

            // Go through each user and perform their appropriate actions
            // In this circumstance, we loop backwards, because if users are timed out
            // for not responding to pings, they'll be removed from the user list.
            for (let i = this.OnlineUsers.Users.length - 1; i >= 0; i--) {
                const user: User = this.OnlineUsers.Users[i];

                // Ignore everything by QuaverBot, as he doesn't matter.
                if (user.IsBot())
                    continue;

                // Clear user spam rates
                if (currentTime - this.TimeSpamRateLastCleared >= this.SPAM_RATE_CLEAR_INTERVAL)
                    user.SpamRate = 0;

                // Ping the user if necessary
                if (currentTime - user.LastPingTime >= this.PING_INTERVAL)
                    user.Ping();

                // Timeout the socket if they haven't responding to our pings in a while.
                if (currentTime - user.LastPongTime >= this.PING_TIMEOUT_TIME) 
                {
                    Logger.Warning(`Timing out inactive client session for: ${user.Username} (#${user.Id}) <${user.Token}>.`);
                    user.Socket.close();
                }
            }

            // NOTE: Important that we update the times actions were last performed AFTER the loop
            // so they don't get updated while iterating over the users.

            // Update the time the spam rate was cleared.
            if (currentTime - this.TimeSpamRateLastCleared >= this.SPAM_RATE_CLEAR_INTERVAL)
                this.TimeSpamRateLastCleared = currentTime;
        }, 500);
    }

    /**
     * \o/
     * @constructor
     */
    public LogStart(): void {
        console.log("            .-.");
        console.log("           ((`-)");
        console.log("            \\\\");
        console.log("             \\\\");
        console.log("      .=\"\"\"=._))");
        console.log("     /  .,   .'");
        console.log("    /__(,_.-'");
        console.log("   `    /|");
        console.log("       /_|__");
        console.log("         | `))");
        console.log("         |");
        console.log("- Albatross (Flamingo v2.0)");
        console.log("- Multiplayer & chat server protocol developed by The Quaver Team");
        console.log("- Licensed under the GNU Affero General Public License version 3 (AGPL-3.0)");
        console.log("- Play Quaver at: https://quavergame.com");
        console.log(`- Started on port: ${this.Port}`);
        console.log();
    }
}