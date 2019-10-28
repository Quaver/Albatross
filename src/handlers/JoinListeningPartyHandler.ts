import User from "../sessions/User";
import ClientPacketJoinListeningParty from "../packets/client/ClientPacketJoinListeningParty";
import Logger from "../logging/Logger";
import Albatross from "../Albatross";
import ServerPacketNotification from "../packets/server/ServerPacketNotification";
import ServerNotificationType from "../enums/ServerNotificationType";
import { join } from "path";

export default class JoinListeningPartyHandler {
    /**
     * Handles when a user requests to join a user's listening party.
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketJoinListeningParty): Promise<void> {
        try {
            const joiningUser = Albatross.Instance.OnlineUsers.GetUserById(packet.User);

            if (!joiningUser)
                return Albatross.SendToUser(user, new ServerPacketNotification(ServerNotificationType.Error, "That user is not online!"));

            // Don't allow them to join their own listening party
            if (user == joiningUser)
                return;

            // User does not have an active listening party
            if (joiningUser.ListeningParty == null)
                return Albatross.SendToUser(user, new ServerPacketNotification(ServerNotificationType.Error, "That user does not have an active listening party!"));

            if (joiningUser.ListeningParty.IsFull())
                return Albatross.SendToUser(user, new ServerPacketNotification(ServerNotificationType.Error, "The listening party you tried to join is full."));
                
            await joiningUser.ListeningParty.AddListener(user);
        } catch (err) {
            Logger.Error(err);
        }
    }
}