import Logger from "../logging/Logger";
import ClientPacketPong from "../packets/client/ClientPacketPong";
import User from "../sessions/User";

export default class PongHandler {
    /**
     * Handles when a user sends pongs
     * @constructor
     */
    public static async Handle(user: User, packet: ClientPacketPong): Promise<void> {
        try {
            user.LastPongTime = Date.now();
        } catch (err) {
            Logger.Error(err);
        }
    }
}