import ClientPacketChangeGameMap from "../packets/client/ClientPacketChangeGameMap";
import Logger from "../logging/Logger";
import User from "../sessions/User";

export default class ChangeGameMapHandler {
    /**
     * Handles when the host of a multiplayer game changes the map of the game.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketChangeGameMap): Promise<void> {
        try {
            if (!user.CurrentGame)
                return Logger.Warning(`${user.ToNameIdString} has tried to change the map of a game, but they're not in one!`);

            if (user.CurrentGame.Host != user)
                return Logger.Warning(`${user.ToNameIdString} has tried to change the map of a game, but they aren't host!`);

            return user.CurrentGame.ChangeMap(packet.MapMd5, packet.MapId, packet.MapsetId, packet.Map, packet.GameMode, packet.DifficultyRating);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}