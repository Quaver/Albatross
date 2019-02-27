import Logger from "../logging/Logger";
import Albatross from "../Albatross";

export default class CloseHandler {
    /**
     * Handles when sockets close the connection from the server
     * @param socket
     * @constructor
     */
    public static async Handle(socket: any): Promise<void> {
        try {
            Albatross.Instance.OnlineUsers.RemoveUser(Albatross.Instance.OnlineUsers.GetUserBySocket(socket));
        } catch (err) {
            Logger.Error(err);
        }
    }
}