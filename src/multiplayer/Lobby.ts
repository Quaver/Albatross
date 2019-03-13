import * as _ from "lodash";
import User from "../sessions/User";

export default class Lobby {
    /**
     * The list of users that are currently in the lobby
     */
    public static Users: User[] = [];

    /**
     * Adds a user to the multiplayer lobby
     */
    public static AddUser(user: User): void {
        if (Lobby.Users.includes(user))
            return;

        Lobby.Users.push(user);

        // console.log("Joined lobby!");
    }

    /**
     * Removes a user from the multiplayer lobby.
     * @param user 
     */
    public static RemoveUser(user: User): void {
        const removed: any = _.remove(Lobby.Users, user);

        /*if (removed && removed.length > 0)
            console.log("Removed from lobby");*/
    }
}