import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import GameMode from "../../enums/GameMode";
import GameModeHelper from "../../utils/GameModeHelper";
import MultiplayerFreeModType from "../../multiplayer/MultiplayerFreeModType";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";

export default class MultiplayerCommandRuleset extends BotCommand {
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
            return await Bot.SendMessage(game.GetChatChannelName(), "Not enough arguments. Specify either `team` or `freeforall` to change the ruleset.");

        switch (args[1].toLowerCase()) {
            case "team":
                game.ChangeRuleset(MultiplayerGameRuleset.Team);
                await Bot.SendMessage(game.GetChatChannelName(), `Ruleset has been changed to: Team.`);
                break;
            case "freeforall":
                game.ChangeRuleset(MultiplayerGameRuleset.Free_For_All);
                await Bot.SendMessage(game.GetChatChannelName(), `Ruleset has been changed to: Free-For-All.`);
                break;
            case "battleroyale":
                game.ChangeRuleset(MultiplayerGameRuleset.Battle_Royale);
                await Bot.SendMessage(game.GetChatChannelName(), `Ruleset has been changed to: Battle Royale.`);
                break;
            default:
                await Bot.SendMessage(game.GetChatChannelName(), "You must specify either `team` or `freeforall`.");
                break;
        }
    }
}