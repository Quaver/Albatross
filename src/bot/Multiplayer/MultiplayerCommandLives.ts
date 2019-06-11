import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";

export default class MultiplayerCommandLives extends BotCommand {
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

        if (game.HealthType != MultiplayerHealthType.Lives)
            return await Bot.SendMessage(game.GetChatChannelName(), "You cannot change the number of lives if the health type is Manual Regeneration.");

        if (args.length < 2)
            return await Bot.SendMessage(game.GetChatChannelName(), "You must specify a number of lives.");

        const lives: any = parseInt(args[1]);

        if (isNaN(lives))
            return await Bot.SendMessage(game.GetChatChannelName(), "You must specify a valid number of lives.");

        if (lives <= 0 || lives > Number.MAX_VALUE)
            return await Bot.SendMessage(game.GetChatChannelName(), "Number of lives must be greater than 0 and less than 2 billion.");

        game.ChangeLivesCount(lives);
        await Bot.SendMessage(game.GetChatChannelName(), `Life count has now been changed to: ${lives}.`);
    }
}