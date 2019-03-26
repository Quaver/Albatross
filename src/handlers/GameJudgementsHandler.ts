import User from "../sessions/User";
import Logger from "../logging/Logger";
import ClientPacketGameJudgements from "../packets/client/ClientPacketGameJudgements";

export default class GameJudgementsHandler {
    /**
     * Handles when the client sends us more judgements for their multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketGameJudgements): Promise<void> {
        try {
            return user.HandleMultiplayerJudgements(packet.Judgements);
        } catch (err) {
            return Logger.Error(err);
        }
    }
}