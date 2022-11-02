import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../handlers/rooster/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import GameMode from "../../enums/GameMode";
import GameModeHelper from "../../utils/GameModeHelper";

export default class MultiplayerCommandDisallowMode extends BotCommand {
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

        const disallowedMode: GameMode | undefined = GameModeHelper.GetGameModeFromShortString(args[1]);

        if (!disallowedMode)
            return await Bot.SendMessage(game.GetChatChannelName(), "Invalid game mode specified! (Example: '4k' or '7k')");
            
        if (!game.AllowedGameModes.includes(disallowedMode))
            return await Bot.SendMessage(game.GetChatChannelName(), "This mode isn't currently allowed!");

        if (game.AllowedGameModes.length == 1)
            return await Bot.SendMessage(game.GetChatChannelName(), "You cannot disallow this game mode because there will be none allowed!");

        game.DisallowGameMode(disallowedMode);
        await Bot.SendMessage(game.GetChatChannelName(), "Game mode has been successfully disallowed for this multiplayer match.");   
    }
}