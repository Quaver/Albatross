import User from "./rooster/User";
import ClientPacketGameScreenLoaded from "../packets/client/ClientPacketGameScreenLoaded";
import Logger from "../logging/Logger";

export default class GameScreenLoadedHandler {
    /**
     * Handles when the client informs us that they're ready to play
     * their multiplayer match
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameScreenLoaded): Promise<void> {
        try {
            user.ReadyToPlayMultiplayerGame();
        } catch (err) {
            return Logger.Error(err);
        }
    }
}