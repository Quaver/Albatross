import User from "./rooster/User";
import ClientPacketFriendship from "../packets/client/ClientPacketFriendship";
import Logger from "../logging/Logger";
import FriendsListAction from "../enums/FriendsListAction";

export default class FriendsListActionHandler {
    /**
     * Handles when the user wants to add/remove a user to their friends list
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketFriendship) : Promise<void> {
        try {
            switch (packet.Action) {
                case FriendsListAction.Add:
                    await user.AddFriend(packet.UserId);
                    break;
                case FriendsListAction.Remove:
                    await user.RemoveFriend(packet.UserId);
                    break;
            }
        } catch (err) {
            Logger.Error(err);
        }
    }
}