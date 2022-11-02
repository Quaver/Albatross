import User from "./rooster/User";
import ClientPacketGameChangeRuleset from "../packets/client/ClientPacketGameChangeRuleset";
import Logger from "../logging/Logger";

export default class GameChangeRulesetHandler {
    /**
     * Handles when the client wants to change the ruleset for the game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameChangeRuleset): Promise<void> {
        try {
            if (user.CurrentGame == null || user.CurrentGame.Host != user)
                return;

            user.CurrentGame.ChangeRuleset(packet.Ruleset);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}