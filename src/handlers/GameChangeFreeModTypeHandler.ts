import User from "./rooster/User";
import ClientPacketGameChangeFreeModType from "../packets/client/ClientPacketGameChangeFreeModType";
import Logger from "../logging/Logger";

export default class GameChangeFreeModTypeHandler {
    /**
     * Changes the free mod type for the game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameChangeFreeModType): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            user.CurrentGame.SetFreeModType(packet.Type);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}