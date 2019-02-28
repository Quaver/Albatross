import Logger from "../logging/Logger";
import PacketId from "../packets/PacketId";
import { JsonObject, JsonConvert } from "json2typescript";
import PongHandler from "./PongHandler";
import ClientPacketPong from "../packets/client/ClientPacketPong";
import ChatMessageHander from "./ChatMessageHandler";
import ClientPacketChatMessage from "../packets/client/ClientPacketChatMessage";

export default class PacketHandler {
    /**
     * Handles mesages from the server
     * @constructor
     */
    public static async Handle(socket: any, message: any): Promise<void> {
        try {
            const msg: any = JSON.parse(message);
            const jsonConvert: JsonConvert = new JsonConvert();
            
            console.log(msg);
            
            switch (msg.id) {
                case PacketId.ClientPong:
                    await PongHandler.Handle(socket, jsonConvert.deserializeObject(msg, ClientPacketPong));
                    break;
                case PacketId.ClientChatMessage:
                    await ChatMessageHander.Handle(socket, jsonConvert.deserializeObject(msg, ClientPacketChatMessage));
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