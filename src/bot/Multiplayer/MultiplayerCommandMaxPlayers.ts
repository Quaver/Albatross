import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";

export default class MultiplayerCommandMaxPlayers extends BotCommand {
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
            return await Bot.SendMessage(game.GetChatChannelName(), "You must specify the number of players.");
            
        let maxPlayers = parseInt(args[1]);
        
        if (isNaN(maxPlayers))
            return await Bot.SendMessage(game.GetChatChannelName(), "You must specify a valid number of players.");

        maxPlayers = game.ClampMaxPlayers(maxPlayers);

        if (maxPlayers < game.Players.length)
            return await Bot.SendMessage(game.GetChatChannelName(), "You cannot set the max players greater than the amount of people in the game. Try kicking some players first.");

        game.ChangeMaxPlayers(maxPlayers);
        await Bot.SendMessage(game.GetChatChannelName(), `Max player count has changed to: ${maxPlayers}.`);
    }
}