import User from "../../sessions/User";
import Privileges from "../../enums/Privileges";
import UserGroups from "../../enums/UserGroups";
import BotCommand from "../BotCommand";

export default class MultiplayerCommandTournamentMode extends BotCommand {
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
        await game.ToggleTournamentMode(!game.TournamentMode);
    }
}