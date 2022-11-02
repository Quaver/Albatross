import User from "./rooster/User";
import ClientPacketGameSongSkipRequest from "../packets/client/ClientPacketGameSongSkipRequest";
import Logger from "../logging/Logger";

export default class GameSongSkipRequestHandler {
    /**
     * Handles when a player in a multiplayer game requests to skip.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameSongSkipRequest): Promise<void> {
        try {
            user.HandleMultiplayerGameSkipRequest();
        } catch (err) {
            return Logger.Error(err);
        }
    }
}