import User from "../sessions/User";
import Albatross from "../Albatross";

export default class AlbatrossBot {
    /**
     * The online user for the bot.
     */
    public static User: User = new User(null, 0, -1, "AlbatrossBot");

    /**
     * Does initialiazation of the bot. Should only be called once 
     */
    public static Initialize(): void {
        Albatross.Instance.OnlineUsers.AddUser(AlbatrossBot.User);
    }
}