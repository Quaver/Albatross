import ClientPacketRequestUserStats from "../packets/client/ClientPacketRequestUserStats";
import Logger from "../logging/Logger";
import User from "../sessions/User";
import { JsonConvert } from "json2typescript";
import Albatross from "../Albatross";
import GameMode from "../enums/GameMode";
import UserStats from "../sessions/UserStats";
import ServerPacketUserStats from "../packets/server/ServerPacketUserStats";

export default class RequestUserStatsHandler {
    /**
     * Handles when a client requests stats from a group of users
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketRequestUserStats): Promise<void> {
        try {
            const jsonConvert: JsonConvert = new JsonConvert();
            const stats: any = {};
    
            for (let i = 0; i < packet.Users.length; i++) {
                const user: User = Albatross.Instance.OnlineUsers.GetUserById(packet.Users[i]);
    
                if (!user)
                    continue;       
    
                if (user.IsMultiplayerBot)
                    continue;
                    
                stats[user.Id] = {
                    1: jsonConvert.serializeObject(user.Stats[GameMode.Keys4]),
                    2: jsonConvert.serializeObject(user.Stats[GameMode.Keys7])
                };
            }
    
            if (Object.keys(stats).length == 0)
                return;

            Albatross.SendToUser(user, new ServerPacketUserStats(stats));

        } catch (err) {
            return Logger.Error(err);
        }
    }
}