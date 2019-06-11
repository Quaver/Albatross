import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";

export default class MultiplayerCommandLongNotesMax extends BotCommand {
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
            return await Bot.SendMessage(game.GetChatChannelName(), "You must specify the maximum long note percentage.");

        const maxPercent = parseInt(args[1]);

        if (isNaN(maxPercent) || maxPercent < 0 || maxPercent > 100)
            return await Bot.SendMessage(game.GetChatChannelName(), "Maximum long note percentage must be a number betwen 0-100%.");

        if (maxPercent < game.MinimumLongNotePercentage)
            return await Bot.SendMessage(game.GetChatChannelName(), `Maximum long note percentage must not be lower than the minimum: ${game.MinimumLongNotePercentage}%.`);

        game.ChangeMaximumLongNotePercentage(maxPercent);
        await Bot.SendMessage(game.GetChatChannelName(), `Maximum long note percentage has been changed to: ${game.MaximumLongNotePercentage}%.`); 
    }
}