import StringHelper from "../utils/StringHelper";
import Logger from "../logging/Logger";
import User from "../sessions/User";
import Albatross from "../Albatross";

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

            // Generate a random token for the user in this session
            LoginHandler.AddSessionToken(socket);

            const user: User = new User(socket, steamId, steamId, steamName);
            Albatross.Instance.OnlineUsers.AddUser(user);
        } catch (err) {
            // TODO: Add required data to log.
            Logger.Error(`${err}`);
            socket.close();
        }
    }

    /**
     * Creates a session token and caches it in Redis for the user to use throughout their session
     * @param socket 
     */
    private static AddSessionToken(socket: any): void {
        socket.token = "dsjaksadjsadjkl321903213902109";

        // TODO: Cache in redis
    } 

    /**
     * Logs an invalid login request
     * @param reason 
     */
    private static LogInvalidRequest(socket: any, reason: string): void {
        throw new Error(`Retrieved invalid login request from: ${socket._socket.remoteAddress} (${reason})`);
    }
}