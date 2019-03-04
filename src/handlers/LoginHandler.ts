import StringHelper from "../utils/StringHelper";
import Logger from "../logging/Logger";
import User from "../sessions/User";
import Albatross from "../Albatross";
import SqlDatabase from "../database/SqlDatabase";
import SteamWebAPI from "../steam/SteamWebAPI";
import ServerPacketLoginReply from "../packets/server/ServerPacketLoginReply";
import ServerPacketPing from "../packets/server/ServerPacketPing";
import ServerPacketChooseUsername from "../packets/server/ServerPacketChooseUsername";
import AsyncHelper from "../utils/AsyncHelper";
import ServerPacketNotification from "../packets/server/ServerPacketNotification";
import ServerNotificationType from "../enums/ServerNotificationType";
import ServerPacketUsersOnline from "../packets/server/ServerPacketUsersOnline";
import ServerPacketUserConnected from "../packets/server/ServerPacketUserConnected";
import ServerPacketUserDisconected from "../packets/server/ServerPacketUserDisconnected";
import ChatManager from "../chat/ChatManager";
import ChatChannel from "../chat/ChatChannel";
import ServerPacketAvailableChatchannel from "../packets/server/ServerPacketAvailableChatChannel";
import Bot from "../bot/Bot";
const axios = require("axios");
const config = require("../config/config.json");
const randomstring = require("randomstring");

export default class LoginHandler {
    /**
     * Handles login requests from users
     * @constructor
     */
    public static async Handle(socket: any): Promise<void> {
        try {
            // Required
            let steamId: string | number | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "id");
            const steamName: string | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "u")
            const pTicket: string | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "pt");
            const client: string | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "c");
            let pcbTicket: string | number | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "pcb");

            // Not Required (Testing/Debug Purposes)
            const testClientKey: string | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "t");
   
            if (!pcbTicket)
                return LoginHandler.LogInvalidRequest(socket, "No PcbTicket Given");

            // Parse the Pcb ticket to an integer, so it can be used in the request to Steam.
            pcbTicket = parseInt(pcbTicket);
            
            if (!steamId)
                return LoginHandler.LogInvalidRequest(socket, "No Steam Id Given");

            // Parse the user's Steam id, so its a number
            steamId = parseInt(steamId);

            if (!steamName)
                return LoginHandler.LogInvalidRequest(socket, "No Steam Name Given");

            if (!pTicket)
                return LoginHandler.LogInvalidRequest(socket, "No PTicket Given");

            if (!client)
                return LoginHandler.LogInvalidRequest(socket, "No client Info Given");

            // So we can pass around one object rather than a bunch.
            const loginDetails: object = {
                steamId,
                steamName,
                pTicket,
                pcbTicket,
                client,
                testClientKey
            };

            // Make sure the user is the Steam user they say they are.
            const steamLogin: any = await LoginHandler.HandleSteamAuthentication(socket, loginDetails);
            const user: User | null = await LoginHandler.GetUser(socket, steamLogin);

            // User doesn't exist, so a packet needs to be sent that alerts them to choose a username.
            // Close the connection as well, as username creation is handled by the API server.
            if (!user) {
                Logger.Warning(`Received login request from: ${steamLogin.steamid}. (they do not have an account yet!)`);
                Albatross.SendToSocket(socket, new ServerPacketChooseUsername());
                return await AsyncHelper.Sleep(100, () => socket.close());            
            }

            // Check if the user is banned
            if (!user.Allowed) {
                Logger.Warning(`Received invalid login request from: ${steamLogin.steamid} (they are banned!)`);

                // Send a notification to the user letting them know that they're ban
                const banned: ServerPacketNotification = new ServerPacketNotification(ServerNotificationType.Error, "You are banned. Email support@quavergame.com.");
                Albatross.SendToUser(user, banned);

                return await AsyncHelper.Sleep(100, () => socket.close());
            }

            if (!await LoginHandler.VerifyGameBuild(socket, user, loginDetails))
                return;

            await LoginHandler.LogIpAddress(socket, user);
            await LoginHandler.UpdateLatestActivityAndAvatar(socket, user);
            await user.UpdateStats();
            await LoginHandler.RemoveMultipleLoginSessions(user);

            // New session
            LoginHandler.GenerateSessionToken(socket, user);

            // Update last ping and pong times so they don't get timed out immediately.
            user.LastPingTime = Date.now();
            user.LastPongTime = Date.now();

            // Safe to add user and consider them online now.
            Albatross.Instance.OnlineUsers.AddUser(user);

            Albatross.SendToUser(user, new ServerPacketLoginReply(user));
            Albatross.SendToUser(user, Albatross.BuildUsersOnlinePacket());
            await LoginHandler.SendAndAutojoinChatChannels(user);

            await Albatross.Broadcast(new ServerPacketUserConnected(user));
 
            await ChatManager.SendMessage(Bot.User, user.Username, `Welcome to the Quaver alpha, ${user.Username}!`);

            if (user.IsMuted())
                await ChatManager.SendMessage(Bot.User, user.Username, 
                    `Your account is muted for another ${(user.MuteEndTime - Date.now()) / 1000 / 60} minutes`);

        } catch (err) {
            // TODO: Add required data to log.
            Logger.Error(`${err}`);

            Albatross.SendToSocket(socket, new ServerPacketNotification(ServerNotificationType.Error, "Failed to login: Unknown Server Error!"))
            return await AsyncHelper.Sleep(100, () => socket.close());  
        }
    }

    /**
     * Handles authentication to Steam.
     * @param loginDetails 
     */
    private static async HandleSteamAuthentication(socket: any, loginDetails: any): Promise<object> {
        const authResponse = await axios.get("https://api.steampowered.com/ISteamUserAuth/AuthenticateUserTicket/v1/", {
            params: {
                key: config.steam.publisherKey,
                appid: config.steam.appId,
                ticket: loginDetails.pTicket.replace(/-/g, "")
            }
        });

        // There was an error while authenticating to Steam!
        if (authResponse.data.response.error || authResponse.data.response.params.result != "OK")
            LoginHandler.LogInvalidRequest(socket, "Failed to authenticate with Steam");

        // User is VAC banned
        if (authResponse.data.response.params.vacbanned)
            LoginHandler.LogInvalidRequest(socket, "VAC Banned");

        // User was banned by us via Steam
        if (authResponse.data.response.params.publisherbanned)
            LoginHandler.LogInvalidRequest(socket, "Publisher Banned");
            
        // Check to see if the user actually owns the game.
        const ownershipResponse = await axios.get("https://partner.steam-api.com/ISteamUser/CheckAppOwnership/v2/", {
            params: {
                key: config.steam.publisherKey,
                appid: config.steam.appId,
                steamid: authResponse.data.response.params.steamid
            }
        })

        // User doesn't own Quaver
        if (!ownershipResponse.data.appownership.ownsapp)
            LoginHandler.LogInvalidRequest(socket, "Doesn't own Quaver on Steam!");

        return authResponse.data.response.params;
    }

    /**
     * Checks the user's game build to see if they need to update it.
     * @param socket 
     * @param user 
     * @param loginDetails 
     */
    private static async VerifyGameBuild(socket: any, user: User, loginDetails: any): Promise<boolean> {
        // Don't bother checking their game build if its a test client.
        if (loginDetails.testClientKey == config.testClientKey)
            return true;

        const split = loginDetails.client.split("|");

        if (split.length != 5)
            LoginHandler.LogInvalidRequest(socket, "Invalid client details");

        const result = await SqlDatabase.Execute("SELECT id FROM game_builds WHERE quaver_dll = ? AND quaver_api_dll = ? AND quaver_server_client_dll = ? " + 
                                                "AND quaver_server_common_dll = ? AND quaver_shared_dll = ? AND allowed = 1 LIMIT 1", 
                                                [split[0], split[1], split[2], split[3], split[4]])

        if (result.length == 0) {
            Albatross.SendToUser(user, new ServerPacketNotification(ServerNotificationType.Error, 
                "Your game client is outdated. Please restart Steam and update it!"))
                
            await AsyncHelper.Sleep(100, () => socket.close());    
            return false        
        }

        return true;
    }

    /**
     * Logs the user's IP address in the database
     * @param socket 
     */
    private static async LogIpAddress(socket: any, user: User): Promise<void> {
        const result = await SqlDatabase.Execute("SELECT ip FROM login_ips WHERE user_id = ? AND ip = ? LIMIT 1", [user.Id, socket._socket.remoteAddress])

        if (result.length != 0)
            return;

        await SqlDatabase.Execute("INSERT INTO login_ips (user_id, ip) VALUES (?, ?)", [user.Id, socket._socket.remoteAddress]);
    }

    /**
     * Updates the user's latest activity and Steam avatar URL in the database.
     * @param user 
     */
    private static async UpdateLatestActivityAndAvatar(socket: any, user: User): Promise<void> {
        const avatar = await SteamWebAPI.GetUserAvatarLink(user.SteamId.toString());
        await SqlDatabase.Execute("UPDATE users SET avatar_url = ?, latest_activity = ? WHERE id = ?", [avatar, Date.now(), user.Id]);
    }

    /**
     * Fetches the user from the database
     * @param socket 
     * @param steamLogin 
     */
    private static async GetUser(socket: any, steamLogin: any): Promise<User | null> {
        const result = await SqlDatabase.Execute("SELECT * FROM users WHERE steam_id = ? LIMIT 1", [steamLogin.steamid]);

        if (result.length == 0)
            return null;

        // Quick access to the user object
        const dbUser: any = result[0];

        return new User(socket, dbUser.id, dbUser.steam_id, dbUser.username, Boolean(dbUser.allowed), dbUser.mute_endtime, dbUser.country,
            dbUser.privileges, dbUser.usergroups, dbUser.avatar_url);
    }

    /**
     * Disconnects multiple login sessions from this user.
     */
    private static async RemoveMultipleLoginSessions(user: User): Promise<void> {
        const alreadyOnline: User[] = Albatross.Instance.OnlineUsers.Users.filter(x => x.Id == user.Id);

        for (let i = 0; i < alreadyOnline.length; i++) {
            Logger.Info(`Detected multiple login session for user: ${user.Username} (#${user.Id}) <${alreadyOnline[i].Token}>.`);

            const packet = new ServerPacketNotification(ServerNotificationType.Error, "Logged out due to signing in from another location.");

            Albatross.SendToUser(alreadyOnline[i], packet);
            await AsyncHelper.Sleep(100, () => alreadyOnline[i].Socket.close());
        }

        return;
    }

    /**
     * Creates a session token and caches it in Redis for the user to use throughout their session
     * @param socket 
     */
    private static GenerateSessionToken(socket: any, user: User): void {
        let token: string | null = null;

        // Make sure the token generated is absolutely random and not in use.
        while (token == null || Albatross.Instance.OnlineUsers.GetUserBySocket({ token }))
            token = randomstring.generate({ length: 64 });

        // Store the token on the socket object for quick access
        socket.token = token;
        user.Token = token;
    } 

    /**
     * Logs an invalid login request
     * @param reason 
     */
    private static LogInvalidRequest(socket: any, reason: string): void {
        throw new Error(`Retrieved invalid login request from: ${socket._socket.remoteAddress} (${reason})`);
    }

    /**
     * Sends the user the available channel list and places them in autojoin channels.
     */
    private static async SendAndAutojoinChatChannels(user: User): Promise<void> {
        for (let name in ChatManager.Channels) {

            const channel: ChatChannel = ChatManager.Channels[name];
            ChatManager.SendAvailableChannel(user, channel);
            
            if (channel.Autojoin)
                await user.JoinChatChannel(channel);
        }
    }
}