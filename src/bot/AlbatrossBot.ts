import User from "../sessions/User";
import Albatross from "../Albatross";
import Privileges from "../enums/Privileges";
import UserGroups from "../enums/UserGroups";
const config = require("../config/config.json");

export default class AlbatrossBot {
    /**
     * The online user for the bot.
     */
    public static User: User = new User(null, 0, -1, config.chatBot.username, true, 0, config.chatBot.country, Privileges.Normal,
        UserGroups.Normal | UserGroups.Admin | UserGroups.Bot, config.chatBot.avatarUrl);

    /**
     * Does initialiazation of the bot. Should only be called once 
     */
    public static async Initialize(): Promise<void> {
        await Albatross.Instance.OnlineUsers.AddUser(AlbatrossBot.User);
    }
}