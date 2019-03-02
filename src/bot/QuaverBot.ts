import User from "../sessions/User";
import Albatross from "../Albatross";
import Privileges from "../enums/Privileges";
import UserGroups from "../enums/UserGroups";
const config = require("../config/config.json");

export default class QuaverBot {
    /**
     * The online user for the bot.
     */
    public static User: User | any = null;

    /**
     * Does initialiazation of the bot. Should only be called once 
     */
    public static async Initialize(): Promise<void> {
        QuaverBot.User = new User(null, config.chatBot.id, config.chatBot.steamId, config.chatBot.username, true, 0, "US", Privileges.Normal,
                        UserGroups.Normal | UserGroups.Bot | UserGroups.Admin, config.chatBot.avatarUrl);

        await Albatross.Instance.OnlineUsers.AddUser(QuaverBot.User);
    }
}