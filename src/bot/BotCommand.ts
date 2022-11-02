import Privileges from "../enums/Privileges";
import UserGroups from "../enums/UserGroups";
import User from "../handlers/rooster/User";

export default abstract class BotCommand {
    /**
     * The usergroups allowed to execute this command
     */
    public abstract AllowedUserGroups: UserGroups[];

    /**
     * The allowed privileges to execute this command
     */
    public abstract AllowedPrivileges: Privileges[];

    /**
     * If the command requires multiplayer host or owner of the multiplayer game
     */
    public RequiresMultiplayerHostOrOwner: boolean = false;

    /**
     * Returns if a user can execute a specific command
     * @param user 
     */
    public CanUserExecute(user: User): boolean {
        // Allow Swan to do whatever
        if (user.IsSwan())
            return true;

        //  Check Privileges
        for (let i = 0; i < this.AllowedPrivileges.length; i++) {
            if (user.HasPrivilege(this.AllowedPrivileges[i]))
                return true;
        }

        // Check Host
        for (let i = 0; i < this.AllowedUserGroups.length; i++) {
            if (user.HasUserGroup(this.AllowedUserGroups[i]))
                return true;
        }

        if (this.RequiresMultiplayerHostOrOwner) {
            if (!user.CurrentGame)
                return false;

            if (user.CurrentGame.Host == user || user.CurrentGame.CreatorId == user.Id)
                return true;
        }

        return false;
    }


    /**
     * Executes the command
     * @param user 
     */
    public Execute(user: User, args: string[]): void {
        if (!this.CanUserExecute(user))
            return;

        this.ExecuteCommand(user, args);
    }

    /**
     * Executes the command
     * @param sender 
     */
    protected abstract ExecuteCommand(sender: User, args: string[]): void;
}