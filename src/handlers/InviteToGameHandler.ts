import User from "./rooster/User";
import ClientPacketInviteToGame from "../packets/client/ClientPacketInviteToGame";
import Logger from "../logging/Logger";
import Albatross from "../Albatross";

export default class InviteToGameHandler {
    /**
     * Handles when a user wants to invite them to the game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketInviteToGame): Promise<void> {
        try {
            const inviteTarget = Albatross.Instance.OnlineUsers.GetUserById(packet.UserId);

            if (!inviteTarget)
                return;

        if (user.CurrentGame == null ||inviteTarget.CurrentGame == user.CurrentGame) 
            return;

        await user.CurrentGame.InvitePlayer(inviteTarget, user);
        } catch (err) {
            Logger.Error(err);
        }
    }
}