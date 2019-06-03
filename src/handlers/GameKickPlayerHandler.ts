import User from "../sessions/User";
import ClientPacketGameKickPlayer from "../packets/client/ClientPacketGameKickPlayer";
import Logger from "../logging/Logger";

export default class GameKickPlayerHandler {
    /**
     * Handles when the click wants to kick a player from their multiplayer game.
     * 
     * Requires host.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameKickPlayer): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            // Find target player
            const target = user.CurrentGame.Players.find(x => x.Id == packet.UserId);

            if (target == null || target == user)
                return;
                
            await user.CurrentGame.KickPlayer(target);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}