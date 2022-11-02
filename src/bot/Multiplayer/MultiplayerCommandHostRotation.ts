import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../handlers/rooster/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import GameMode from "../../enums/GameMode";
import GameModeHelper from "../../utils/GameModeHelper";
import MultiplayerFreeModType from "../../multiplayer/MultiplayerFreeModType";

export default class MultiplayerCommandHostRotation extends BotCommand {
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

        game.ChangeAutoHostRotation(!game.AutoHostRotation);
        await Bot.SendMessage(game.GetChatChannelName(), `Auto Host Rotation is now turned ${(game.AutoHostRotation ? "on" : "off")}.`);
    }
}