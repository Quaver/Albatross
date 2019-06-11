import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";

export default class MultiplayerCommandHost extends BotCommand {
    /**
     * The usergroups allowed to execute this command
     */
    public AllowedUserGroups: UserGroups[] = [];

    /**
     * The allowed privileges to execute this command
     */
    public AllowedPrivileges: Privileges[] = [];

    constructor() {
        super();
        this.RequiresMultiplayerHostOrOwner = true;
    }

    /**
     * Executes the bot command
     * @param user 
     */
    public async ExecuteCommand(user: User, args: string[]): Promise<void> {
        if (user == null || user.CurrentGame == null)
            return;

        const targetUsername: string = args[1].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        const game = user.CurrentGame;

        if (target == game.Host)
            return await Bot.SendMessage(game.GetChatChannelName(), "You're already host!");

        if (!target)
            return await Bot.SendMessage(game.GetChatChannelName(), "That user is not online!");

        if (target.CurrentGame == user.CurrentGame)
            await user.CurrentGame.ChangeHost(target);
        else
            return await Bot.SendMessage(game.GetChatChannelName(), "That user isn't in the game!");
    }
}