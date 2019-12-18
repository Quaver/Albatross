import ClientPacketChangeGamePassword from "../packets/client/ClientPacketChangeGamePassword";
import User from "../sessions/User";
import Logger from "../logging/Logger";

export default class GameChangePasswordHandler {
        /**
     * Handles when a user wants to change the name of the multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketChangeGamePassword) : Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            await user.CurrentGame.ChangePassword(packet.Password);
        } catch (err) {
            Logger.Error(err);
        }
    }
}