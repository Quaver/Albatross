import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../sessions/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import GameMode from "../../enums/GameMode";
import GameModeHelper from "../../utils/GameModeHelper";
import { isNaN } from "lodash";
import SqlDatabase from "../../database/SqlDatabase";

export default class MultiplayerCommandChangeMap extends BotCommand {
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

        if (!user.CurrentGame.Host || args.length < 2)
            return;
        
        const id = parseInt(args[1]);

        if (isNaN(id))
            return await Bot.SendMessage(game.GetChatChannelName(), "Invalid map id!");

        const result = await SqlDatabase.Execute("SELECT * FROM maps WHERE id = ? LIMIT 1", [id]);

        if (result.length == 0)
            return await Bot.SendMessage(game.GetChatChannelName(), "That map does not exist!");

        const map = result[0];
        const mapStr = `${map.artist} - ${map.title} [${map.difficulty_name}]`;

        await game.ChangeMap(map.md5, map.id, map.mapset_id, mapStr, map.game_mode, map.difficulty_rating, 
            [], 0, map.alternative_md5, true);

        await Bot.SendMessage(game.GetChatChannelName(), `Map has been changed to: ${mapStr} (#${id})`);
    }
}