import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";

export default class MultiplayerCommandMinDiff extends BotCommand {
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

        const minDiff = parseFloat(args[1]);
        const game = user.CurrentGame;

        if (isNaN(minDiff) || minDiff < 0)
            return await Bot.SendMessage(game.GetChatChannelName(), "The minimum difficulty number must be a number and 0 or greater.");

        if (minDiff > game.MaximumDifficultyRating)
            return await Bot.SendMessage(game.GetChatChannelName(), "The minimum difficulty rating must be lower than the maximmum.");

        game.ChangeMinimumDifficulty(minDiff);
        await Bot.SendMessage(game.GetChatChannelName(), `The minimum difficulty has been changed to: ${minDiff}.`);   
    }
}