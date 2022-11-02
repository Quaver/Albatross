import BotCommand from "../BotCommand";
import UserGroups from "../../enums/UserGroups";
import Privileges from "../../enums/Privileges";
import User from "../../handlers/rooster/User";
import Albatross from "../../Albatross";
import Bot from "../Bot";
import MultiplayerHealthType from "../../multiplayer/MultiplayerHealthType";
import MultiplayerGameRuleset from "../../multiplayer/MultiplayerGameRuleset";
import ModHelper from "../../utils/ModHelper";

export default class MultiplayerCommandMods extends BotCommand {
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

        if (!game.TournamentMode)
            return;

        if (args.length < 2)
            return await Bot.SendMessage(game.GetChatChannelName(), "Incorrect command usage: !mp mods <mod1,mod2,mod3>");

        const modMap = ModHelper.GetModStrings();
        let mods = 0;

        args[1].split(",").forEach(x => {
            const mod = modMap.get(x);

            if (!mod)
                return;

            if ((mods & mod) != 0)
                return;

            mods += mod;
        });

        await game.ChangeModifiers(mods.toString(), game.DifficultyRating);

        for (let i = 0; i < game.Players.length; i++)
            game.ChangePlayerModifiers(game.Players[i], "0", true);

        await Bot.SendMessage(game.GetChatChannelName(), `Game modifiers changed to: ${ModHelper.GetModsString(mods)}. ` + 
            "All player modifiers have been reset.");
    }
}