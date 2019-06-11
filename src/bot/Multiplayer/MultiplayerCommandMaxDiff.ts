import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";

export default class MultiplayerCommandMaxDiff extends BotCommand {
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

        if (!user.CurrentGame.Host || args.length < 2)
            return;

        const maxDiff = parseInt(args[1]);
        const game = user.CurrentGame;

        if (isNaN(maxDiff) || maxDiff < 0)
            return await Bot.SendMessage(game.GetChatChannelName(), "The maximum difficulty number must be a number and 0 or greater.");

        if (maxDiff < game.MinimumDifficultyRating)
            return await Bot.SendMessage(game.GetChatChannelName(), "The maximum difficulty rating must be greater than the minimum.");

        game.ChangeMaximumDifficulty(maxDiff);
        await Bot.SendMessage(game.GetChatChannelName(), `The maximum difficulty has been changed to: ${maxDiff}.`);    
    }
}