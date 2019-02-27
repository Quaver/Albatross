import AlbatrossRouter from "./router/AlbatrossRouter";
import Logger from "./logging/Logger";
import StringHelper from "./utils/StringHelper";
import LoginHandler from "./handlers/LoginHandler";
import PacketHandler from "./handlers/PacketHandler";
import CloseHandler from "./handlers/CloseHandler";
import ServerPacketPing from "./packets/server/ServerPacketPing";
import {setInterval} from "timers";
import OnlineUserStore from "./sessions/OnlineUserStore";
import AlbatrossBot from "./bot/AlbatrossBot";

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
        AlbatrossBot.Initialize();

        Logger.Info(this.OnlineUsers.GetUserById(0).ToString());
        Logger.Info(this.OnlineUsers.Count.toString());
    }
    
    /**
     * Starts the server
     * @constructor
     */
    public async Start(): Promise<void> {
        const ws = new WebSocketServer({ port: this.Port });
        
        ws.on("connection", async (socket: any) => {
            await LoginHandler.Handle(socket);
            
            console.log(this.OnlineUsers.GetUserBySocket(socket).ToString());
            this.OnlineUsers.GetUserByUsername("Swan").Kick();

            socket.on("message", async (message: any) => await PacketHandler.Handle(socket,  message));
            socket.on("close",async  () => await CloseHandler.Handle(socket));
        });
        
        ws.on("error", async (err: any) => {
            Logger.Error(err);
        });

        this.LogStart();
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
        console.log("- Multiplayer server & chat protocol developed by The Quaver Team");
        console.log("- Licensed under the GNU Affero General Public License version 3 (AGPL-3.0)");
        console.log("- Play Quaver at: https://quavergame.com");
        console.log(`- Started on port: ${this.Port}`);
        console.log();
    }
}