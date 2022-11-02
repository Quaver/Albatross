import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../handlers/rooster/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";

export default class MultiplayerCommandTeamWins extends BotCommand {
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

        if (game.Ruleset != MultiplayerGameRuleset.Team)
            return await Bot.SendMessage(game.GetChatChannelName(), "Teams are not enabled, so you cannot change the win count");

        if (args.length < 3)
            return await Bot.SendMessage(game.GetChatChannelName(), "Incorrect command usage: !teamwins <red|blue> <wins>");

        const wins = parseInt(args[2]);

        if (isNaN(wins) || wins < 0 || wins > 9999)
            return await Bot.SendMessage(game.GetChatChannelName(), "Invalid win count.");
            
        switch (args[1]) {
            case "red":
                game.UpdateTeamWinCount(wins, game.BlueTeamWins);
                break;
            case "blue":
                game.UpdateTeamWinCount(game.RedTeamWins, wins);
                break;
            default:
                return await Bot.SendMessage(game.GetChatChannelName(), "Invalid team. Specify either 'red' or 'blue'.");
        }

        await Bot.SendMessage(game.GetChatChannelName(), `Team win count changed - Red: ${game.RedTeamWins} | Blue: ${game.BlueTeamWins}`);
    }
}