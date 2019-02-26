import Logger from "../logging/Logger";
import ClientPacketPong from "../packets/client/ClientPacketPong";

export default class PongHandler {
    /**
     * Handles when a user sends pongs
     * @constructor
     */
    public static async Handle(socket: any, packet: ClientPacketPong): Promise<void> {
        try {
            Logger.Info(`Received user pong at: ${packet.Timestamp}`);
        } catch (err) {
            Logger.Error(err);
        }
    }
}