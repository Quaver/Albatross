import User from "./rooster/User";
import ClientPacketSpectateMultiplayerGame from "../packets/client/ClientPacketSpectateMultiplayerGame";
import Logger from "../logging/Logger";
import Lobby from "../multiplayer/Lobby";

export default class SpectateMultiplayerGameHandler {
    /**
     * Handles when the user requests to spectate a multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketSpectateMultiplayerGame): Promise<void> {
        try {
            return await user.SpectateMultiplayerGame(Lobby.Games[packet.GameId], packet.Password);
        } catch (err) {
            Logger.Error(err);
        }
    }
}