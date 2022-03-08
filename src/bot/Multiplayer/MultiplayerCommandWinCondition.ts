import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";
import ModHelper from "../../utils/ModHelper";
import MultiplayerWinCondition from "../../multiplayer/MultiplayerWinCondition";

export default class MultiplayerCommandWinCondition extends BotCommand {
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
        if (user == null || user.CurrentGame == null || user.CurrentGame.InProgress)
            return;

        const game = user.CurrentGame;

        if (!game.TournamentMode)
            return;

        if (args.length < 2)
            return await Bot.SendMessage(game.GetChatChannelName(), "Incorrect command usage: !mp wincondition <rating|accuracy>");

        switch (args[1].toLowerCase()) {
            case "rating":
                game.WinCondition = MultiplayerWinCondition.PerformanceRating;
                break;
            case "accuracy":
                game.WinCondition = MultiplayerWinCondition.Accuracy;
                break;
            default:
                return await Bot.SendMessage(game.GetChatChannelName(), "Invalid win condition. Only 'rating' and 'accuracy' can be selected.");
        }

        await Bot.SendMessage(game.GetChatChannelName(), `Win condition has been set to ${MultiplayerWinCondition[game.WinCondition]}!`);
    }
}