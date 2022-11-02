import Logger from "../logging/Logger";
import User from "./rooster/User";
import ClientPacketGamePlayerChangeModifiers from "../packets/client/ClientPacketGamePlayerChangeModifiers";

export default class GamePlayerChangeModifiersHandler {
    /**
     * Handles when an individual player changes their modifiers in the game.
     */
    public static async Handle(user: User, packet: ClientPacketGamePlayerChangeModifiers): Promise<void> {
        try {
            if (!user.CurrentGame)
                return Logger.Warning(`${user.ToNameIdString()} wanted to change player mods, but they aren't in a game.`);

            user.CurrentGame.ChangePlayerModifiers(user, packet.Modifiers);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}