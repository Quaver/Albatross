import User from "../sessions/User";
import ClientPacketGameAcceptInvite from "../packets/client/ClientPacketGameAcceptInvite";
import Logger from "../logging/Logger";
import MultiplayerGame from "../multiplayer/MultiplayerGame";
import Lobby from "../multiplayer/Lobby";
import Albatross from "../Albatross";
import ServerPacketJoinedGameFailed from "../packets/server/ServerPacketJoinGameFailed";
import JoinGameFailureReason from "../enums/JoinGameFailureReason";
import ServerPacketMultiplayerGameInfo from "../packets/server/ServerPacketMultiplayerGameInfo";

export default class GameAcceptInviteHandler {
    /**
     * Handles when the user accepts a game invite in-game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameAcceptInvite): Promise<void> {
        try {
            const game: MultiplayerGame | undefined = Lobby.Games[packet.MatchId];

            if (!game) {
                Albatross.SendToUser(user, new ServerPacketJoinedGameFailed(JoinGameFailureReason.MatchNoExists));
                return Logger.Warning(`${user.ToNameIdString()} accepted invite for match: ${packet.MatchId}, but it doesn't exist anymore.`)
            }

            // Send them game info and then place them into the game
            Albatross.SendToUser(user, new ServerPacketMultiplayerGameInfo(game));
            user.JoinMultiplayerGame(game);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}