import Logger from "../logging/Logger";
import PacketId from "../packets/PacketId";
import { JsonObject, JsonConvert } from "json2typescript";
import PongHandler from "./PongHandler";
import ClientPacketPong from "../packets/client/ClientPacketPong";

export default class PacketHandler {
    /**
     * Handles mesages from the server
     * @constructor
     */
    public static async Handle(socket: any, message: any): Promise<void> {
        try {
            const msg: any = JSON.parse(message);
            const jsonConvert: JsonConvert = new JsonConvert();
            
            switch (msg.id) {
                case PacketId.ClientPong:
                    const pong: ClientPacketPong = jsonConvert.deserializeObject(msg, ClientPacketPong);
                    console.log(pong);
                    await PongHandler.Handle(socket, pong);
                    break;
                default:
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error(`Client sent a packet that can't be handled: ${msg}`);
            }
        } catch (err) {
            Logger.Error(err);
        }
    }
}