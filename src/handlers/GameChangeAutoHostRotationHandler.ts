import ClientPacketGameChangeAutoHostRotation from "../packets/client/ClientPacketGameChangeAutoHostRotation";
import User from "../sessions/User";
import Logger from "../logging/Logger";

export default class GameChangeAutoHostRotationHandler {
    /**
     * Changes the auto host rotation setting for the game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameChangeAutoHostRotation): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            user.CurrentGame.ChangeAutoHostRotation(packet.On);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}