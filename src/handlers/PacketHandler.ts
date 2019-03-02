import Logger from "../logging/Logger";
import PacketId from "../packets/PacketId";
import { JsonObject, JsonConvert } from "json2typescript";
import PongHandler from "./PongHandler";
import ClientPacketPong from "../packets/client/ClientPacketPong";
import ChatMessageHander from "./ChatMessageHandler";
import ClientPacketChatMessage from "../packets/client/ClientPacketChatMessage";
import RequestLeaveChatChannelHandler from "./RequestLeaveChatChannelHandler";
import ClientPacketRequestLeaveChatChannel from "../packets/client/ClientPacketRequestLeaveChatChannel";
import User from "../sessions/User";
import Albatross from "../Albatross";
import RequestJoinChatChannelHandler from "./RequestJoinChatChannelHandler";
import ClientPacketRequestJoinChatChannel from "../packets/client/ClientPacketRequestJoinChatChannel";

export default class PacketHandler {
    /**
     * Handles mesages from the server
     * @constructor
     */
    public static async Handle(socket: any, message: any): Promise<void> {
        try {
            const user: User = Albatross.Instance.OnlineUsers.GetUserBySocket(socket);

            if (!user)
                return Logger.Error(`Received packet: ${message} from socket IP: ${socket._socket.remoteAddress}, but they aren't logged in!`);

            const msg: any = JSON.parse(message);
            const jsonConvert: JsonConvert = new JsonConvert();
            
            console.log(user.Username + " " + message);
            
            switch (msg.id) {
                case PacketId.ClientPong:
                    await PongHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketPong));
                    break;
                case PacketId.ClientChatMessage:
                    await ChatMessageHander.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketChatMessage));
                    break;
                case PacketId.ClientRequestLeaveChatChannel:
                    await RequestLeaveChatChannelHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketRequestLeaveChatChannel));
                    break;
                case PacketId.ClientRequestJoinChatChannel:
                    await RequestJoinChatChannelHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketRequestJoinChatChannel));
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