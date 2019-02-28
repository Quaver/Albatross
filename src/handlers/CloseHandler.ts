import Logger from "../logging/Logger";
import Albatross from "../Albatross";
import ServerPacketUserDisconected from "../packets/server/ServerPacketUserDisconnected";
import User from "../sessions/User";

export default class CloseHandler {
    /**
     * Handles when sockets close the connection from the server
     * @param socket
     * @constructor
     */
    public static async Handle(socket: any): Promise<void> {
        try {
            const user: User = Albatross.Instance.OnlineUsers.GetUserBySocket(socket);
            
            Albatross.Instance.OnlineUsers.RemoveUser(user);
            Albatross.Broadcast(new ServerPacketUserDisconected(user.Id));
        } catch (err) {
            Logger.Error(err);
        }
    }
}