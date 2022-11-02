import ClientPacketGamePlayerTeamChanged from "../packets/client/ClientPacketGamePlayerTeamChanged";
import Logger from "../logging/Logger";
import User from "./rooster/User";

export default class GamePlayerTeamChangedHandler {
    /**
     * Handles when a player wants to switch teams
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGamePlayerTeamChanged): Promise<void> {
        try {
            if (user.CurrentGame == null)
                return Logger.Warning(`${user.ToNameIdString()} wants to switch teams, but they aren't in a game.`);

            if (user.CurrentGame.InProgress)
                return Logger.Warning(`${user.ToNameIdString()} wants to switch teams, but the game is already in progress.`);

            user.CurrentGame.ChangeUserTeam(user, packet.Team);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}