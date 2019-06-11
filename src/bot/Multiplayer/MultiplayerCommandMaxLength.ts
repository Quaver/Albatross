import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";

export default class MultiplayerCommandMaxLength extends BotCommand {
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

        const game = user.CurrentGame;
        
        if (!user.CurrentGame.Host || args.length < 2)
            return;

        const length = parseInt(args[1]);

        if (isNaN(length) || length <= 0)
            return await Bot.SendMessage(game.GetChatChannelName(), "The maximum length must be greater than 0 seconds.");

        game.ChangeMaximumSongLength(length);
        await Bot.SendMessage(game.GetChatChannelName(), `The maximum length allowed for this game has been changed to: ${length} seconds.`);
    }
}