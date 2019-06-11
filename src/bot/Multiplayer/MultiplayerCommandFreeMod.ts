import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import GameMode from "../../enums/GameMode";
import GameModeHelper from "../../utils/GameModeHelper";
import MultiplayerFreeModType from "../../multiplayer/MultiplayerFreeModType";

export default class MultiplayerCommandFreeMod extends BotCommand {
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

        if ((game.FreeModType & MultiplayerFreeModType.Regular) != 0) {
            game.DisableFreeModType(MultiplayerFreeModType.Regular);
            await Bot.SendMessage(game.GetChatChannelName(), "Free Mod has been disabled for this match. All mods have been reset!");
        } else {
            game.EnableFreeModType(MultiplayerFreeModType.Regular);
            await Bot.SendMessage(game.GetChatChannelName(), "Free Mod has been enabled for this match. All mods have been reset!");
        }
    }
}