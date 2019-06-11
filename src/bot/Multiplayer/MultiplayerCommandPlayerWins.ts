import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";

export default class MultiplayerCommandPlayerWins extends BotCommand {
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

        if (game.Ruleset != MultiplayerGameRuleset.Free_For_All)
            return await Bot.SendMessage(game.GetChatChannelName(), "You cannot change player win counts in team mode.");

        if (args.length < 3)
            return await Bot.SendMessage(game.GetChatChannelName(), "Incorrect command usage: !playerwins <user_name> <wins>");

        const playerWins = parseInt(args[2]);

        if (isNaN(playerWins) || playerWins < 0 || playerWins > 9999)
            return await Bot.SendMessage(game.GetChatChannelName(), "Invalid win count."); 
            
        const playerWinsTargetUsername: string = args[1].replace(/_/g, " ");
        const playerWinsTarget: User = Albatross.Instance.OnlineUsers.GetUserByUsername(playerWinsTargetUsername);

        if (!playerWinsTarget)
            return await Bot.SendMessage(game.GetChatChannelName(), "That user is not online!");

        if (!game.Players.includes(playerWinsTarget))
            return await Bot.SendMessage(game.GetChatChannelName(), "That player is not in the game!");

        game.UpdatePlayerWinCount(playerWinsTarget, playerWins);
        await Bot.SendMessage(game.GetChatChannelName(), `${playerWinsTarget.Username}'s win count has been changed to: ${playerWins}.`);
    }
}