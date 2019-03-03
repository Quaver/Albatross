import User from "../sessions/User";
import ClientPacketRequestUserStatus from "../packets/client/ClientPacketRequestUserStatus";
import Albatross from "../Albatross";
import { JsonConvert } from "json2typescript";
import ServerPacketUserStatus from "../packets/server/ServerPacketUserStatus";

export default class RequestUserStatusHandler {
    /**
     * Handles when a user is requesting to retrieve user client statuses.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketRequestUserStatus): Promise<void> {
        const jsonConvert: JsonConvert = new JsonConvert();
        const statuses: any = {};

        for (let i = 0; i < packet.UserIds.length; i++) {
            const user: User = Albatross.Instance.OnlineUsers.GetUserById(packet.UserIds[i]);

            if (!user)
                continue;       

            statuses[user.Id] = jsonConvert.serializeObject(user.CurrentStatus);
        }

        Albatross.SendToUser(user, new ServerPacketUserStatus(statuses));
    }
}