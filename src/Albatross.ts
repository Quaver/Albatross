import Logger from "./logging/Logger";
import StringHelper from "./utils/StringHelper";
import LoginHandler from "./handlers/LoginHandler";
import PacketHandler from "./handlers/PacketHandler";
import CloseHandler from "./handlers/CloseHandler";
import ServerPacketPing from "./packets/server/ServerPacketPing";
import {setInterval} from "timers";
import OnlineUserStore from "./sessions/OnlineUserStore";
import AlbatrossBot from "./bot/AlbatrossBot";
import RedisHelper from "./database/RedisHelper";

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
     * @param port
     */
    constructor(port: number) {
        this.Port = port;
        Albatross.Instance = this;
        this.OnlineUsers = new OnlineUserStore();
    }
    
    /**
     * Starts the server
     * @constructor
     */
    public async Start(): Promise<void> {
        await this.CleanPreviousSessions();
        await AlbatrossBot.Initialize();

        const ws = new WebSocketServer({ port: this.Port });
        
        ws.on("connection", async (socket: any) => {
            await LoginHandler.Handle(socket);
            socket.on("message", async (message: any) => await PacketHandler.Handle(socket,  message));
            socket.on("close",async  () => await CloseHandler.Handle(socket));
        });
        
        ws.on("error", async (err: any) => {
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