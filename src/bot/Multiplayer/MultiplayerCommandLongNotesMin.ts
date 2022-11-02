import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../handlers/rooster/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";

export default class MultiplayerCommandLongNotesMin extends BotCommand {
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

        if (args.length < 2)
            return await Bot.SendMessage(game.GetChatChannelName(), "You must specify the minimum long note percentage.");

        const percent = parseInt(args[1]);

        if (isNaN(percent) || percent < 0 || percent > 100)
            return await Bot.SendMessage(game.GetChatChannelName(), "Minimum long note percentage must be a number betwen 0-100%.");

        if (percent > game.MaximumLongNotePercentage)
            return await Bot.SendMessage(game.GetChatChannelName(), `Minimum long note percentage must not be greater than the maximum: ${game.MaximumLongNotePercentage}%.`);

        game.ChangeMinimumLongNotePercentage(percent);
        await Bot.SendMessage(game.GetChatChannelName(), `Minimum long note percentage has been changed to: ${game.MinimumLongNotePercentage}%.`); 
    }
}