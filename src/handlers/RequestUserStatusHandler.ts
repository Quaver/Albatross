import User from "../sessions/User";
import ClientPacketRequestUserStatus from "../packets/client/ClientPacketRequestUserStatus";
import Albatross from "../Albatross";

export default class RequestUserStatusHandler {
    /**
     * Handles when a user is requesting to retrieve user client statuses.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketRequestUserStatus): Promise<void> {
        for (let i = 0; i < packet.UserIds.length; i++) {
            const user: User = Albatross.Instance.OnlineUsers.GetUserById(packet.UserIds[i]);

            if (!user)
                continue;       
        }
    }
}