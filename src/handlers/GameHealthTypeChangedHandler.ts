import User from "../sessions/User";
import ClientPacketGameChangeHealthType from "../packets/client/ClientPacketGameChangeHealthType";
import Logger from "../logging/Logger";

export default class GameHealthTypeChangedHandler {
    /**
     * Changes the health type of the multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameChangeHealthType): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            user.CurrentGame.ChangeHealthType(packet.HealthType);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}