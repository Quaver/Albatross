import User from "./rooster/User";
import ClientPacketGameChangeOtherPlayerTeam from "../packets/client/ClientPacketGameChangeOtherPlayerTeam";
import Logger from "../logging/Logger";

export default class GameChangeOtherPlayerTeamHandler {
    /**
     * Changes a given player's team in the multiplayer game
     * 
     * Requires Host.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameChangeOtherPlayerTeam): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            // Find target player
            const target = user.CurrentGame.Players.find(x => x.Id == packet.UserId);

            if (target == null || target == user)
                return;
                
            user.CurrentGame.ChangeUserTeam(target, packet.Team);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}