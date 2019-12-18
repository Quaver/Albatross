import User from "../sessions/User";
import ClientPacketChangeGameName from "../packets/client/ClientPacketChangeGameName";
import Logger from "../logging/Logger";

export default class GameChangeNameHandler {
    /**
     * Handles when a user wants to change the name of the multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketChangeGameName) : Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            if (!packet.Name)
                return;

            await user.CurrentGame.ChangeName(packet.Name.substring(0, 50));
        } catch (err) {
            Logger.Error(err);

        }
    }
}