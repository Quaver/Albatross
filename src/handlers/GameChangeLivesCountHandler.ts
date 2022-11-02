import User from "./rooster/User";
import ClientPacketGameChangeLivesCount from "../packets/client/ClientPacketGameChangeLivesCount";
import Logger from "../logging/Logger";

export default class GameChangeLivesCountHandler {
    /**
     * Changes the amount of lives the game has
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameChangeLivesCount): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            user.CurrentGame.ChangeLivesCount(packet.NumLives);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}