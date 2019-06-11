import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import GameMode from "../../enums/GameMode";
import GameModeHelper from "../../utils/GameModeHelper";
import MultiplayerFreeModType from "../../multiplayer/MultiplayerFreeModType";

export default class MultiplayerCommandKick extends BotCommand {
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
            return await Bot.SendMessage(game.GetChatChannelName(), "You need to specify a player to kick.");

        const kickTargetUsername: string = args[1].replace(/_/g, " ");
        const kickTarget: User = Albatross.Instance.OnlineUsers.GetUserByUsername(kickTargetUsername);

        if (!kickTarget)
            return await Bot.SendMessage(game.GetChatChannelName(), "That user is not online!");

        if (kickTarget.CurrentGame == user.CurrentGame) {
            await user.CurrentGame.KickPlayer(kickTarget);
            await Bot.SendMessage(game.GetChatChannelName(), `${kickTarget.Username} has been kicked from the game!`);
        }
        else
            return await Bot.SendMessage(game.GetChatChannelName(), "That user isn't in the game!");
    }
}