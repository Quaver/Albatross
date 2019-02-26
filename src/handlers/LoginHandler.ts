import StringHelper from "../utils/StringHelper";
import Logger from "../logging/Logger";

export default class LoginHandler {
    /**
     * Handles login requests from users
     * @constructor
     */
    public static async Handle(socket: any): Promise<void> {
        try {
            const steamId: string | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "id");
            const pTicket: string | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "pt");
            let pcbTicket: string| number | null = StringHelper.GetUrlParameter(socket.upgradeReq.url, "pcb");
            
            if (!steamId)
                throw new Error(`Retrieved invalid login request from: ${socket._socket.remoteAddress} (No Steam Id)`);


            console.log(steamId);

            Logger.Info("Handling login request: " + socket.upgradeReq.url);
            
            
        } catch (err) {

            Logger.Error(`${err}\n` +
                ``);

            socket.close();
        }
    }
}