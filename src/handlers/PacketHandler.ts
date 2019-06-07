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
import ClientPacketCreateGame from "../packets/client/ClientPacketCreateGame";
import CreateGameHandler from "./CreateGameHandler";
import MultiplayerGame from "../multiplayer/MultiplayerGame";
import GameLeaveHandler from "./GameLeaveHandler";
import ClientPacketLeaveGame from "../packets/client/ClientPacketLeaveGame";
import JoinGameHandler from "./JoinGameHandler";
import ClientPacketJoinGame from "../packets/client/ClientPacketJoinGame";
import ChangeGameMapHandler from "./ChangeGameMapHandler";
import ClientPacketChangeGameMap from "../packets/client/ClientPacketChangeGameMap";
import ClientNoMapHandler from "./ClientNoMapHandler";
import ClientPacketGameNoMap from "../packets/client/ClientPacketNoMap";
import GamePlayerHasMapHandler from "./GamePlayerHasMapHandler";
import ClientPacketGamePlayerHasMap from "../packets/client/ClientPacketGamePlayerHasMap";
import ClientPlayerFinishedHandler from "./ClientPlayerFinishedHandler";
import ClientPacketPlayerFinished from "../packets/client/ClientPacketPlayerFinished";
import ClientPacketGameJudgements from "../packets/client/ClientPacketGameJudgements";
import GameJudgementsHandler from "./GameJudgementsHandler";
import GameScreenLoadedHandler from "./GameScreenLoadedHandler";
import ClientPacketGameScreenLoaded from "../packets/client/ClientPacketGameScreenLoaded";
import GameSongSkipRequestHandler from "./GameSongSkipRequestHandler";
import ClientPacketGameSongSkipRequest from "../packets/client/ClientPacketGameSongSkipRequest";
import GamePlayerReadyHandler from "./GamePlayerReadyHandler";
import ClientPacketGamePlayerReady from "../packets/client/ClientPacketGamePlayerReady";
import GamePlayerNotReadyHandler from "./GamePlayerNotReadyHandler";
import ClientPacketGamePlayerNotReady from "../packets/client/ClientPacketGamePlayerNotReady";
import GameStartCountdownHandler from "./GameStartCountdownHandler";
import ClientPacketGameStartCountdown from "../packets/client/ClientPacketGameStartCountdown";
import GameStopCountdownHandler from "./GameStopCountdownHandler";
import ClientPacketGameStopCountdown from "../packets/client/ClientPacketGameStopCountdown";
import GameChangeModifiersHandler from "./GameChangeModifiersHandler";
import ClientPacketGameChangeModifiers from "../packets/client/ClientPacketGameChangeModifiers";
import GamePlayerChangeModifiersHandler from "./GamePlayerChangeModifiersHandler";
import ClientPacketGamePlayerChangeModifiers from "../packets/client/ClientPacketGamePlayerChangeModifiers";
import GameAcceptInviteHandler from "./GameAcceptInviteHandler";
import ClientPacketGameAcceptInvite from "../packets/client/ClientPacketGameAcceptInvite";
import GamePlayerTeamChangedHandler from "./GamePlayerTeamChangedHandler";
import ClientPacketGamePlayerTeamChanged from "../packets/client/ClientPacketGamePlayerTeamChanged";
import RequestUserStatsHandler from "./RequestUserStatsHandler";
import ClientPacketRequestUserStats from "../packets/client/ClientPacketRequestUserStats";
import GameKickPlayerHandler from "./GameKickPlayerHandler";
import ClientPacketGameKickPlayer from "../packets/client/ClientPacketGameKickPlayer";
import GameTransferHostHandler from "./GameTransferHostHandler";
import ClientPacketGameTransferHost from "../packets/client/ClientPacketGameTransferHost";
import GameChangeOtherPlayerTeamHandler from "./GameChangeOtherPlayerTeamHandler";
import ClientPacketGameChangeOtherPlayerTeam from "../packets/client/ClientPacketGameChangeOtherPlayerTeam";
import GameChangeRulesetHandler from "./GameChangeRulesetHandler";
import ClientPacketGameChangeRuleset from "../packets/client/ClientPacketGameChangeRuleset";
import GameChangeMaxPlayersHandler from "./GameChangeMaxPlayersHandler";
import ClientPacketGameChangeMaxPlayers from "../packets/client/ClientPacketGameChangeMaxPlayers";
import GameChangeAutoHostRotationHandler from "./GameChangeAutoHostRotationHandler";
import ClientPacketGameChangeAutoHostRotation from "../packets/client/ClientPacketGameChangeAutoHostRotation";
import GameHealthTypeChangedHandler from "./GameHealthTypeChangedHandler";
import ClientPacketGameChangeHealthType from "../packets/client/ClientPacketGameChangeHealthType";
import GameChangeLivesCountHandler from "./GameChangeLivesCountHandler";
import ClientPacketGameChangeLivesCount from "../packets/client/ClientPacketGameChangeLivesCount";
import GameChangeFreeModTypeHandler from "./GameChangeFreeModTypeHandler";
import ClientPacketGameChangeFreeModType from "../packets/client/ClientPacketGameChangeFreeModType";
import GameHostSelectingMapHandler from "./GameHostSelectingMapHandler";
import ClientPacketGameHostSelectingMap from "../packets/client/ClientPacketGameHostSelectingMap";
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
                case PacketId.ClientCreateGame:
                    const createGamePacket: ClientPacketCreateGame = jsonConvert.deserializeObject(msg, ClientPacketCreateGame);
                    createGamePacket.Game = jsonConvert.deserializeObject(msg.g, MultiplayerGame);
                    createGamePacket.Game.Password = msg.g.pw;

                    if (msg.g.p)
                        createGamePacket.Game.HasPassword = true;

                    await CreateGameHandler.Handle(user, createGamePacket);
                    break;
                case PacketId.ClientLeaveGame:
                    await GameLeaveHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketLeaveGame));
                    break;
                case PacketId.ClientJoinGame:
                    await JoinGameHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketJoinGame));
                    break;
                case PacketId.ClientChangeGameMap:
                    await ChangeGameMapHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketChangeGameMap));
                    break;
                case PacketId.ClientGamePlayerNoMap:
                    await ClientNoMapHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameNoMap));
                    break;
                case PacketId.ClientGamePlayerHasMap:
                    await GamePlayerHasMapHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGamePlayerHasMap));
                    break;
                case PacketId.ClientPlayerFinished:
                    await ClientPlayerFinishedHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketPlayerFinished));
                    break;
                case PacketId.ClientGameJudgements:
                    await GameJudgementsHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameJudgements));
                    break;
                case PacketId.ClientGameScreenLoaded:
                    await GameScreenLoadedHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameScreenLoaded));
                    break;
                case PacketId.ClientGameSongSkipRequest:
                    await GameSongSkipRequestHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameSongSkipRequest));
                    break;
                case PacketId.ClientGamePlayerReady:
                    await GamePlayerReadyHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGamePlayerReady));
                    break;
                case PacketId.ClientGamePlayerNotReady:
                    await GamePlayerNotReadyHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGamePlayerNotReady));
                    break;
                case PacketId.ClientGameStartCountdown:
                    await GameStartCountdownHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameStartCountdown));
                    break;
                case PacketId.ClientGameStopCountdown:
                    await GameStopCountdownHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameStopCountdown));
                    break;
                case PacketId.ClientGameChangeModifiers:
                    await GameChangeModifiersHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameChangeModifiers));
                    break;
                case PacketId.ClientGamePlayerChangeModifiers:
                    await GamePlayerChangeModifiersHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGamePlayerChangeModifiers));
                    break;
                case PacketId.ClientGameAcceptInvite:
                    await GameAcceptInviteHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameAcceptInvite));
                    break;
                case PacketId.ClientGamePlayerTeamChanged:
                    await GamePlayerTeamChangedHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGamePlayerTeamChanged));
                    break;   
                case PacketId.ClientRequestUserStats:
                    await RequestUserStatsHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketRequestUserStats));
                    break;
                case PacketId.ClientGameKickPlayer:
                    await GameKickPlayerHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameKickPlayer));
                    break;
                case PacketId.ClientGameTransferHost:
                    await GameTransferHostHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameTransferHost));
                    break;
                case PacketId.ClientGameChangeOtherPlayerTeam:
                    await GameChangeOtherPlayerTeamHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameChangeOtherPlayerTeam));
                    break;
                case PacketId.ClientGameChangeRuleset:
                    await GameChangeRulesetHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameChangeRuleset));
                    break;
                case PacketId.ClientGameChangeMaxPlayers:
                    await GameChangeMaxPlayersHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameChangeMaxPlayers));
                    break;
                case PacketId.ClientGameChangeAutoHostRotation:
                    await GameChangeAutoHostRotationHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameChangeAutoHostRotation));
                    break;
                case PacketId.ClientGameChangeHealthType:
                    await GameHealthTypeChangedHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameChangeHealthType));
                    break;
                case PacketId.ClientGameChangeLivesCount:
                    await GameChangeLivesCountHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameChangeLivesCount));
                    break;
                case PacketId.ClientGameChangeFreeModType:
                    await GameChangeFreeModTypeHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameChangeFreeModType));
                    break;
                case PacketId.ClientGameHostSelectingMap:
                    await GameHostSelectingMapHandler.Handle(user, jsonConvert.deserializeObject(msg, ClientPacketGameHostSelectingMap));
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