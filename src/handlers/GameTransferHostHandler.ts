import ClientPacketGameTransferHost from "../packets/client/ClientPacketGameTransferHost";
import Logger from "../logging/Logger";
import User from "../sessions/User";

export default class GameTransferHostHandler {
    /**
     * Transfers host to another person in the multiplayer game
     * 
     * Requires host.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameTransferHost): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            // Find target player
            const target = user.CurrentGame.Players.find(x => x.Id == packet.UserId);

            if (target == null || target == user)
                return;
                
            await user.CurrentGame.ChangeHost(target);
        } catch (err) {
            return Logger.Error(err);
        }
    }
} 