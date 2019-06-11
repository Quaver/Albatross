import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";

export default class MultiplayerCommandClearWins extends BotCommand {
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

        switch (game.Ruleset) {
            case MultiplayerGameRuleset.Team:
                game.UpdateTeamWinCount(0, 0);
                await Bot.SendMessage(game.GetChatChannelName(), "Team win count has been reset.");
                break;
            case MultiplayerGameRuleset.Free_For_All:
                for (let i = 0; i < game.Players.length; i++)
                    game.UpdatePlayerWinCount(game.Players[i], 0, false);

                // Inform lobby users at the end to make sure that packet only gets sent once
                await Bot.SendMessage(game.GetChatChannelName(), "All players' win counts have been reset.");
                game.InformLobbyUsers();
                break;
        }
    }
}