import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../handlers/rooster/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";

export default class MultiplayerCommandHealth extends BotCommand {
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
            return await Bot.SendMessage(game.GetChatChannelName(), "You must specify either `regen` or `lives`.");

        switch (args[1].toLowerCase()) {
            case "regen":
                game.ChangeHealthType(MultiplayerHealthType.ManualRegeneration);
                await Bot.SendMessage(game.GetChatChannelName(), "Health type has been changed to: 'Manual Regeneration.'");
                break;
            case "lives":
                game.ChangeHealthType(MultiplayerHealthType.Lives);
                await Bot.SendMessage(game.GetChatChannelName(), `Health type has been changed to: 'Lives (${game.Lives}).'`);
                break;
        }
    }
}