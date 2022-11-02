import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../handlers/rooster/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";

export default class MultiplayerCommandReferee extends BotCommand {
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

        const targetUsername: string = args[1].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await Bot.SendMessage(game.GetChatChannelName(), "That user is not online!");

        if (target.Id == game.RefereeUserId)
            return await Bot.SendMessage(game.GetChatChannelName(), "You're already the referee of the game!");

        if (target.CurrentGame == user.CurrentGame) {
            await user.CurrentGame.SetReferee(target);
            return await Bot.SendMessage(game.GetChatChannelName(), `${target.Username} is now a referee of the game!`);
        }
        else
            return await Bot.SendMessage(game.GetChatChannelName(), "That user isn't in the game!");
    }
}