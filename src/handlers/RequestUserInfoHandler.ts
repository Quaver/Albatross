import User from "./rooster/User";
import ClientPacketRequestUserInfo from "../packets/client/ClientPacketRequestUserInfo";
import Albatross from "../Albatross";
import ServerPacketUserInfo from "../packets/server/ServerPacketUserInfo";

export default class RequestUserInfoHandler {
    /**
     * Handles when the user is requesting information about a collection of users
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketRequestUserInfo): Promise<void> {
        const users: object[] = [];

        for (let i = 0; i < packet.UserIds.length; i++) {
            const user: User = Albatross.Instance.OnlineUsers.GetUserById(packet.UserIds[i]);

            if (!user)
                continue;

            users.push(user.Serialize());
        }

        Albatross.SendToUser(user, new ServerPacketUserInfo(users));
    }
}