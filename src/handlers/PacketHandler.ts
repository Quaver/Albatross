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
import ClientStatusUpdateHandler from "./ClientStatusUpdateHandler";
import ClientPacketStatusUpdate from "../packets/client/ClientPacketStatusUpdate";
import UserClientStatus from "../objects/UserClientStatus";
import RequestUserInfoHandler from "./RequestUserInfoHandler";
import ClientPacketRequestUserInfo from "../packets/client/ClientPacketRequestUserInfo";
import RequestUserStatusHandler from "./RequestUserStatusHandler";
import ClientPacketRequestUserStatus from "../packets/client/ClientPacketRequestUserStatus";
import LobbyJoinHandler from "./LobbyJoinHandler";
import ClientPacketLobbyJoin from "../packets/client/ClientPacketLobbyJoin";
import LobbyLeaveHandler from "./LobbyLeaveHandler";
import ClientPacketLobbyLeave from "../packets/client/ClientPacketLobbyLeave";
const config = require("../config/config.json");

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
            
            if (config.logPacketTransfer)
                Logger.Info(`Received Packet: ${user.Username} (#${user.Id}) -> ${PacketId[msg.id]} -> "${message}"`);
            
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
                case PacketId.ClientStatusUpdate:
                    // Since its an object within an object, we have to handle it a bit differently and deserialize
                    // both objects because the lib doesn't handle it for some reason.
                    const updatePacket: ClientPacketStatusUpdate = jsonConvert.deserializeObject(msg, ClientPacketStatusUpdate);
                    updatePacket.Status = jsonConvert.deserializeObject(msg.st, UserClientStatus);  
                    await ClientStatusUpdateHandler.Handle(user, updatePacket);
                    break;
                case PacketId.ClientRequestUserInfo:
                    await RequestUserInfoHandler.Handle(user, jsonConvert.deserializeObject(msg,ClientPacketRequestUserInfo));
                    break;
                case PacketId.ClientRequestUserStatus:
                    await RequestUserStatusHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketRequestUserStatus));
                    break;
                case PacketId.ClientLobbyJoin:
                    await LobbyJoinHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketLobbyJoin));
                    break;
                case PacketId.ClientLobbyLeave:
                    await LobbyLeaveHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketLobbyLeave));
                    break;
                default:
                    // noinspection ExceptionCaughtLocallyJS
                    throw new Error(`${user.Username} (#${user.Id}) -> sent a packet that can't be handled -> "${message}"`);
            }
        } catch (err) {
            Logger.Error(err);
        }
    }
}