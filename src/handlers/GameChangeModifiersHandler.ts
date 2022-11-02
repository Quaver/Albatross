import ClientPacketGameChangeModifiers from "../packets/client/ClientPacketGameChangeModifiers";
import Logger from "../logging/Logger";
import User from "./rooster/User";

export default class GameChangeModifiersHandler {
    /**
     * Handles when the host of a match changes the activated modifiers
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameChangeModifiers): Promise<void> {
        try {
            if (!user.CurrentGame)
                return Logger.Warning(`${user.ToNameIdString()} sent ${packet.Id}, but they aren't in a match!`);

            if (user.CurrentGame.Host != user)
                return Logger.Warning(`${user.ToNameIdString()} sent ${packet.Id}, but they aren't host!`);

            user.CurrentGame.ChangeModifiers(packet.Modifiers, packet.DifficultyRating);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}