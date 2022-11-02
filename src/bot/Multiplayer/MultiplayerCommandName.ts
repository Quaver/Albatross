import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../handlers/rooster/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import GameMode from "../../enums/GameMode";
import GameModeHelper from "../../utils/GameModeHelper";
import MultiplayerFreeModType from "../../multiplayer/MultiplayerFreeModType";

export default class MultiplayerCommandName extends BotCommand {
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
            return await Bot.SendMessage(game.GetChatChannelName(), "You need to specify a new name for the game");

        args.splice(0, 1);

        const name: string = args.join(" ");

        if (name.length > 50)
            return await Bot.SendMessage(game.GetChatChannelName(), "The name you have specified is too long. It must be under 50 characters");

        await game.ChangeName(name);
        await Bot.SendMessage(game.GetChatChannelName(), `The game name has been changed to: "${name}"`);        
    }
}