import User from "../sessions/User";
import Albatross from "../Albatross";
import Privileges from "../enums/Privileges";
import UserGroups from "../enums/UserGroups";
import ChatChannel from "../chat/ChatChannel";
import ChatManager from "../chat/ChatManager";
import ServerPacketNotification from "../packets/server/ServerPacketNotification";
import ServerNotificationType from "../enums/ServerNotificationType";
import AdminActionLogger from "../admin/AdminActionLogger";
import AdminActionLogType from "../admin/AdminActionLogType";
import Lobby from "../multiplayer/Lobby";
import MultiplayerGame from "../multiplayer/MultiplayerGame";
import MultiplayerGameType from "../multiplayer/MultiplayerGameType";
import MultiplayerGameRuleset from "../multiplayer/MultiplayerGameRuleset";
import GameMode from "../enums/GameMode";
import GameModeHelper from "../utils/GameModeHelper";
import MultiplayerFreeModType from "../multiplayer/MultiplayerFreeModType";
import Logger from "../logging/Logger";
import ModHelper from "../utils/ModHelper";
import MultiplayerHealthType from "../multiplayer/MultiplayerHealthType";
const config = require("../config/config.json");

export default class Bot {
    /**
     * The online user for the bot.
     */
    public static User: User | any = null;

    /**
     * Does initialiazation of the bot. Should only be called once 
     */
    public static async Initialize(): Promise<void> {
        Bot.User = new User(null, config.chatBot.id, config.chatBot.steamId, config.chatBot.username, true, 0, "US", Privileges.Normal,
                        UserGroups.Normal | UserGroups.Bot | UserGroups.Admin, config.chatBot.avatarUrl);

        await Albatross.Instance.OnlineUsers.AddUser(Bot.User);
    }

    /**
     * Responds to any bot commands in public chats
     */
    public static async HandlePublicMessageCommands(sender: User, channel: ChatChannel, message: string): Promise<void> {
        
        Bot.HandleCommands(sender, channel.Name, message.split(" "));
    }

    /**
     * Responds to any bot messages in private chats
     */
    public static async HandlePrivateMessageCommands(sender: User, receiver: User, message: string): Promise<void> {
        if (receiver != Bot.User)
            return;

        // We give the username of the sender here because we want confirmations to be sent
        // back to the user.
        Bot.HandleCommands(sender, sender.Username, message.split(" "))
    }

    /**
     * Does the actual handling of bot commands
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async HandleCommands(sender: User, to: string, args: string[]): Promise<void> {
        if (args.length == 0 || !args[0].startsWith("!"))
            return;

        const command: string = args[0].split("!")[1];
        args.shift();

        switch (command.toLowerCase()) {
            case "help":
                await Bot.ExecuteHelpCommand(sender, to, args);
                break;
            case "discord":
                await Bot.ExecuteDiscordCommand(sender, to, args);
                break;
            case "commands":
                await Bot.ExecuteCommandsCommand(sender, to, args);
                break;
            case "skins":
                await Bot.ExecuteSkinsCommand(sender, to, args);
                break;
            case "gameplay":
                await Bot.ExecuteGameplayCommand(sender, to, args);
                break;
            case "offtopic":
                await Bot.ExecuteOfftopicCommand(sender, to, args);
                break;
            case "spam":
                await Bot.ExecuteSpamCommand(sender, to, args);
                break;
            case "bugs":
            case "issues":
            case "features":
            case "github":
                await Bot.ExecuteGithubCommand(sender, to, args);
            case "kick":
                await Bot.ExecuteKickCommand(sender, to, args);
                break;
            case "ban":
                await Bot.ExecuteBanCommand(sender, to, args);
                break;
            case "alertall":
            case "notifyall":
                await Bot.ExecuteNotifyAllCommand(sender, to, args);
                break;
            case "alertuser":
            case "notifyuser":
                await Bot.ExecuteNotifyUserCommand(sender, to, args);
                break;
            case "roll":
                await Bot.ExecuteRollCommand(sender, to, args);
                break;
            case "unmute":
                await Bot.ExecuteUnmuteCommand(sender, to, args);
                break;
            case "mute":
                await Bot.ExecuteMuteCommand(sender, to, args);
                break;
            case "mp":
                await Bot.HandleMultiplayerCommands(sender, to, args);
                break;
        }
    }

    /**
     * Executes the !help command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteHelpCommand(sender: User, to: string, args: string[]): Promise<void> {
        await Bot.SendMessage(to, `Hey there, ${sender.Username}! I'm ${Bot.User.Username}, a bot that's here to help!\n\n` + 
            `- Type "/help" for a list of client-side commands you can use!\n` + 
            `- You can also check out our wiki on the website to learn more about Quaver.`);
    }

      /**
     * Executes the !discord command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteDiscordCommand(sender: User, to: string, args: string[]): Promise<void> {
        await Bot.SendMessage(to, `You can join our Discord at the following link: https://discord.gg/nJa8VFr`);
    }

     /**
     * Executes the !commands command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteCommandsCommand(sender: User, to: string, args: string[]): Promise<void> {
        await Bot.SendMessage(to, `You can view the list of commands at: https://quavergame.com/wiki/Commands`);
    }

     /**
     * Executes the !skins command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteSkinsCommand(sender: User, to: string, args: string[]): Promise<void> {
        await Bot.SendMessage(to, `You can learn more about skinning at: https://quavergame.com/wiki/Skins`);
    }

     /**
     * Executes the !gameplay command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteGameplayCommand(sender: User, to: string, args: string[]): Promise<void> {
        await Bot.SendMessage(to, `You can learn more about gameplay at: https://quavergame.com/wiki/Gameplay`);
    }

    /**
     * Executes the !offtopic command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteOfftopicCommand(sender: User, to: string, args: string[]): Promise<void> {
        await Bot.SendMessage(to, `Please keep the discussion on-topic to avoid a mute.`);
    }

    /**
     * Executes the !spam command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteSpamCommand(sender: User, to: string, args: string[]): Promise<void> {
        await Bot.SendMessage(to, `Please do not spam the chat to avoid a mute.`);
    }

    /**
     * Executes the !github command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteGithubCommand(sender: User, to: string, args: string[]): Promise<void> {
        await Bot.SendMessage(to, `You can report bugs, request new features, or help out with development on Github: https://github.com/Quaver/Quaver`);
    }

    /**
     * Executes the !kick command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteKickCommand(sender: User, to: string, args: string[]): Promise<void> {
        if (!sender.HasPrivilege(Privileges.KickUsers))
            return;

        if (args.length == 0)
            return await Bot.SendMessage(to, `Invalid command usage. Try using it like: "!kick <user_name> <reason>"`);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await Bot.SendMessage(to, `Could not kick: "${targetUsername}" because they are offline.`);

        if (target == Bot.User)
            return Bot.SendIdiotMessage(to);

        await target.Kick();
    }

    /**
     * Executes the !ban command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteBanCommand(sender: User, to: string, args: string[]): Promise<void> {
        if (!sender.HasPrivilege(Privileges.BanUsers))
            return;

        if (args.length == 0)
            return await Bot.SendMessage(to, `Invalid command usage. Try using it like: "!ban <user_name> <reason>"`);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await Bot.SendMessage(to, `Could not ban: "${targetUsername}" because they are offline.`);

        if (target == Bot.User)
            return Bot.SendIdiotMessage(to);

        await target.Ban();
    }

    
    /**
     * Executes the !!notifyall command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteNotifyAllCommand(sender: User, to: string, args: string[]): Promise<void> {
        if (!sender.HasPrivilege(Privileges.NotifyUsers))
            return;

        if (args.length == 0)
            return await Bot.SendMessage(to, `Invalid command usage. Try using it like: "!notifyall <message>"`);

        const message: string = args.join(" ");

        Albatross.Broadcast(new ServerPacketNotification(ServerNotificationType.Info, message));
        await Bot.SendMessage(to, `Successfully notified all users with message: ${message}`);
    }

    /**
     * Executes the !notifyuser command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteNotifyUserCommand(sender: User, to: string, args: string[]): Promise<void> {
        if (!sender.HasPrivilege(Privileges.NotifyUsers))
            return;

        if (args.length == 0)
            return await Bot.SendMessage(to, `Invalid command usage. Try using it like: "!notifyuser <user_name> <message>"`);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await Bot.SendMessage(to, `Could not notify: "${targetUsername}" because they are offline.`);

        if (target == Bot.User)
            return Bot.SendIdiotMessage(to);

        args.shift();
        
        const message: string = args.join(" ");

        Albatross.SendToUser(target, new ServerPacketNotification(ServerNotificationType.Info, message));
        await Bot.SendMessage(to, `Successfully notified ${target.Username} with message: ${message}`);
    }

     /**
     * Executes the !roll command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteRollCommand(sender: User, to: string, args: string[]): Promise<void> {
        const rng: number = Math.floor((Math.random() * 100) + 0);
        await Bot.SendMessage(to, `${sender.Username} has rolled a ${rng}!`);
    }

    /**
     * Executes the !unmute command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteUnmuteCommand(sender: User, to: string, args: string[]): Promise<void> {
        if (!sender.HasPrivilege(Privileges.MuteUsers))
            return;

        if (args.length == 0)
            return await Bot.SendMessage(to, `Invalid command usage. Try using it like: "!unmute <user_name>"`);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await Bot.SendMessage(to, `Could not unmute: "${targetUsername}" because they are offline.`);

        if (target == Bot.User)
            return Bot.SendIdiotMessage(to);

        args.shift();

        await target.Unmute();
        await AdminActionLogger.Add(sender, target, AdminActionLogType.Unmuted);
        await Bot.SendMessage(to, `Successfully unmuted: ${target.Username}`);
    }

    /**
     * Executes the !mute command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteMuteCommand(sender: User, to: string, args: string[]): Promise<void> {
        if (!sender.HasPrivilege(Privileges.MuteUsers))
            return;

        if (args.length < 3)
            return await Bot.ShowInvalidMuteCommandMessage(to);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await Bot.SendMessage(to, `Could not unmute: "${targetUsername}" because they are offline.`);

        if (target == Bot.User)
            return await Bot.SendIdiotMessage(to);

        let length: number = parseInt(args[1]);
        
        if (isNaN(length))
            return await Bot.ShowInvalidMuteCommandMessage(to);

        // The number of seconds to mute the user for
        let seconds: number;

        switch (args[2]) {
            case "s":
                seconds = length;
                break;
            case "m":
                seconds = length * 60;
                break;
            case "h":
                seconds = length * 60 * 60;
                break;
            case "d":
                seconds = length * 60 * 60 * 24;
                break;
            default:
                return await Bot.ShowInvalidMuteCommandMessage(to);
        }  
        
        // Max mute should be 30 days
        if (seconds > 30 * 60 * 60 * 24)
            return await Bot.SendMessage(to, "Mute time must not be greater than a month");

        const reason = args.slice(3).join(" ");

        await target.Mute(seconds, reason, sender.Id);
        await AdminActionLogger.Add(sender, target, AdminActionLogType.Updated, `Muted for ${seconds} seconds`);
        await Bot.SendMessage(to, `${sender.Username} has muted ${target.Username} (#${target.Id}) for reason: ${reason || "None"}`);
    }

    /**
     * Sends a bot by QuaverBot
     * @param to 
     * @param message 
     */
    public static async SendMessage(to: string, message: string): Promise<void> {
        await ChatManager.SendMessage(Bot.User, to, message);
    } 

    /**
     * OK
     */
    private static async SendIdiotMessage(to: string): Promise<void> {
        await Bot.SendMessage(to, `Stop and think about what you're doing with your life right now.`);
    }

    /**
     * Sends a message to the user letting them know that they've used the mute command wrongly. 
     * @param to 
     */
    private static async ShowInvalidMuteCommandMessage(to: string): Promise<void> {
        await Bot.SendMessage(to, `Invalid command usage. Try using it like '!mute <user_name> <length> <s/m/h/d> <reason>'.`);
    }

    /**
     * Handles multiplayer lobby commands
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async HandleMultiplayerCommands(sender: User, to: string, args: string[]): Promise<void> {
        if (args.length == 0)
            return;

        if (!sender.CurrentGame)
            return;

        const game: MultiplayerGame = sender.CurrentGame;

        switch (args[0]) {
            // Starts the match immediately.
            case "start":
                if (!sender.CurrentGame.Host)
                    return;              

                await sender.CurrentGame.Start();
                break;
            // Starts the match countdown
            case "startcountdown":
                if (!sender.CurrentGame.Host)
                    return;              

                await sender.CurrentGame.StartMatchCountdown();
                break;
            // Ends the match
            case "end":
                if (!sender.CurrentGame.Host)
                    return;  
                 
                await sender.CurrentGame.End(true);         
                break;       
            case "stopcountdown":
                if (!sender.CurrentGame.Host)
                    return;

                await sender.CurrentGame.StopMatchCountdown();
                break;         
            // Changes the map's host 
            case "host":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;
 
                const targetUsername: string = args[1].replace(/_/g, " ");
                const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

                if (target == sender)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You're already host!");

                if (!target)
                    return await Bot.SendMessage(game.GetChatChannelName(), "That user is not online!");

                if (target.CurrentGame == sender.CurrentGame)
                    await sender.CurrentGame.ChangeHost(target);
                else
                    return await Bot.SendMessage(game.GetChatChannelName(), "That user isn't in the game!");
                break;
            // Changes the minimum difficulty requirements of the match
            case "mindiff":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;

                const minDiff = parseFloat(args[1]);

                if (isNaN(minDiff) || minDiff < 0)
                    return await Bot.SendMessage(game.GetChatChannelName(), "The minimum difficulty number must be a number and 0 or greater.");

                if (minDiff > game.MaximumDifficultyRating)
                    return await Bot.SendMessage(game.GetChatChannelName(), "The minimum difficulty rating must be lower than the maximmum.");

                game.ChangeMinimumDifficulty(minDiff);
                await Bot.SendMessage(game.GetChatChannelName(), `The minimum difficulty has been changed to: ${minDiff}.`);   
                break;
            // Changes the maximum difficulty requirements of the match
            case "maxdiff":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;

                const maxDiff = parseInt(args[1]);

                if (isNaN(maxDiff) || maxDiff < 0)
                    return await Bot.SendMessage(game.GetChatChannelName(), "The maximum difficulty number must be a number and 0 or greater.");

                if (maxDiff < game.MinimumDifficultyRating)
                    return await Bot.SendMessage(game.GetChatChannelName(), "The maximum difficulty rating must be greater than the minimum.");

                game.ChangeMaximumDifficulty(maxDiff);
                await Bot.SendMessage(game.GetChatChannelName(), `The maximum difficulty has been changed to: ${maxDiff}.`);             
                break;
            // Changes the maximum length requirement of the song
            case "maxlength":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;

                const length = parseInt(args[1]);

                if (isNaN(length) || length <= 0)
                    return await Bot.SendMessage(game.GetChatChannelName(), "The maximum length must be greater than 0 seconds.");

                game.ChangeMaximumSongLength(length);
                await Bot.SendMessage(game.GetChatChannelName(), `The maximum length allowed for this game has been changed to: ${length} seconds.`);
                break;
            // Allows maps for a specific game mode to be selected
            case "allowmode":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;
                    
                const allowedMode: GameMode | undefined = GameModeHelper.GetGameModeFromShortString(args[1]);

                if (!allowedMode)
                    return await Bot.SendMessage(game.GetChatChannelName(), "Invalid game mode specified! (Example: '4k' or '7k')");
                    
                if (game.AllowedGameModes.includes(allowedMode))
                    return await Bot.SendMessage(game.GetChatChannelName(), "This mode is already allowed for this match!");

                game.AllowGameMode(allowedMode);
                await Bot.SendMessage(game.GetChatChannelName(), "Game mode has been successfully allowed for this multiplayer match.");
                break;
            // Disallows maps for a specific game mode to be selected
            case "disallowmode":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;

                const disallowedMode: GameMode | undefined = GameModeHelper.GetGameModeFromShortString(args[1]);

                if (!disallowedMode)
                    return await Bot.SendMessage(game.GetChatChannelName(), "Invalid game mode specified! (Example: '4k' or '7k')");
                    
                if (!game.AllowedGameModes.includes(disallowedMode))
                    return await Bot.SendMessage(game.GetChatChannelName(), "This mode isn't currently allowed!");

                if (game.AllowedGameModes.length == 1)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You cannot disallow this game mode because there will be none allowed!");

                game.DisallowGameMode(disallowedMode);
                await Bot.SendMessage(game.GetChatChannelName(), "Game mode has been successfully disallowed for this multiplayer match.");               
                break;
            case "freemod":
                if (!sender.CurrentGame.Host)
                    return;

                if ((game.FreeModType & MultiplayerFreeModType.Regular) != 0) {
                    game.DisableFreeModType(MultiplayerFreeModType.Regular);
                    await Bot.SendMessage(game.GetChatChannelName(), "Free Mod has been disabled for this match. All mods have been reset!");
                } else {
                    game.EnableFreeModType(MultiplayerFreeModType.Regular);
                    await Bot.SendMessage(game.GetChatChannelName(), "Free Mod has been enabled for this match. All mods have been reset!");
                }
                break;
            case "freerate":
                if (!sender.CurrentGame.Host)
                    return;

                if ((game.FreeModType & MultiplayerFreeModType.Rate) != 0) {
                    game.DisableFreeModType(MultiplayerFreeModType.Rate);
                    await Bot.SendMessage(game.GetChatChannelName(), "Free Rate has been disabled for this match. All mods have been reset!");
                } else {
                    game.EnableFreeModType(MultiplayerFreeModType.Rate);
                    await Bot.SendMessage(game.GetChatChannelName(), "Free Rate has been enabled for this match. All mods have been reset!");
                }
                break;
            case "playermods":
                let playerModsString: string = "Here are all the mods each player is using:\n---------------------------\n";

                for (let i = 0; i < game.Players.length; i++) {
                    const pms = game.PlayerMods.find(x => x.Id == game.Players[i].Id);

                    if (!pms)
                        return;

                    playerModsString += `${game.Players[i].Username} - ${ModHelper.GetModsString(parseInt(pms.Mods))}\n`;
                }

                await Bot.SendMessage(game.GetChatChannelName(), playerModsString);
                break;
            case "globalmods":
                await Bot.SendMessage(game.GetChatChannelName(), `The currently active global mods are: ${ModHelper.GetModsString(parseInt(game.Modifiers))}`);
                break;
            case "kick":
                if (!sender.CurrentGame.Host)
                    return;
                    
                if (args.length < 2)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You need to specify a player to kick.");

                const kickTargetUsername: string = args[1].replace(/_/g, " ");
                const kickTarget: User = Albatross.Instance.OnlineUsers.GetUserByUsername(kickTargetUsername);

                if (!kickTarget)
                    return await Bot.SendMessage(game.GetChatChannelName(), "That user is not online!");

                if (kickTarget.CurrentGame == sender.CurrentGame) {
                    await sender.CurrentGame.KickPlayer(kickTarget);
                    await Bot.SendMessage(game.GetChatChannelName(), `${kickTarget.Username} has been kicked from the game!`);
                }
                else
                    return await Bot.SendMessage(game.GetChatChannelName(), "That user isn't in the game!");
                break;
            case "name":
                if (!sender.CurrentGame.Host)
                    return;

                if (args.length < 2)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You need to specify a new name for the game");

                args.splice(0, 1);

                const name: string = args.join(" ");

                if (name.length >= 100)
                    return await Bot.SendMessage(game.GetChatChannelName(), "The name you have specified is too long. It must be under 100 characters");

                await game.ChangeName(name);
                await Bot.SendMessage(game.GetChatChannelName(), `The game name has been changed to: "${name}"`);
                break;
             case "invite":
                if (args.length < 2)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You need to specify a player to invite.");

                const inviteTargetUsername: string = args[1].replace(/_/g, " ");
                const inviteTarget: User = Albatross.Instance.OnlineUsers.GetUserByUsername(inviteTargetUsername);

                if (!inviteTarget)
                    return await Bot.SendMessage(game.GetChatChannelName(), "That user is not online!");

                if (inviteTarget.CurrentGame == sender.CurrentGame) 
                    return await Bot.SendMessage(game.GetChatChannelName(), `That user is already in the game!`);

                game.InvitePlayer(inviteTarget, sender);
                return await Bot.SendMessage(game.GetChatChannelName(), `Successfully invited ${inviteTarget.Username} to the game.`);
                break;
            case "health":
                if (!sender.CurrentGame.Host)
                    return;

                if (args.length < 2)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You must specify either `regen` or `lives`.");

                switch (args[1].toLowerCase()) {
                    case "regen":
                        game.ChangeHealthType(MultiplayerHealthType.ManualRegeneration);
                        await Bot.SendMessage(game.GetChatChannelName(), "Health type has been changed to: 'Manual Regeneration.'");
                        break;
                    case "lives":
                        game.ChangeHealthType(MultiplayerHealthType.Lives);
                        await Bot.SendMessage(game.GetChatChannelName(), `Health type has been changed to: 'Lives (${game.Lives}).'`);
                        break;
                }
                break;
            case "lives":
                if (!sender.CurrentGame.Host)
                    return;

                if (game.HealthType != MultiplayerHealthType.Lives)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You cannot change the number of lives if the health type is Manual Regeneration.");

                if (args.length < 2)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You must specify a number of lives.");

                const lives: any = parseInt(args[1]);

                if (isNaN(lives))
                    return await Bot.SendMessage(game.GetChatChannelName(), "You must specify a valid number of lives.");

                if (lives <= 0 || lives > Number.MAX_VALUE)
                    return await Bot.SendMessage(game.GetChatChannelName(), "Number of lives must be greater than 0 and less than 2 billion.");

                game.ChangeLivesCount(lives);
                await Bot.SendMessage(game.GetChatChannelName(), `Life count has now been changed to: ${lives}.`);
                break;
            case "rules":
                let rules: string = "Multiplayer Game Rules:\n" + 
                                        "----------------\n";
                
                rules += `Ruleset - ${MultiplayerGameRuleset[game.Ruleset]}\n`;
                rules += `Mods - ${ModHelper.GetModsString(parseInt(game.Modifiers))}\n`;
                rules += `Auto Host Rotation - ${game.AutoHostRotation}\n`;
                rules += `Minimum Difficulty Rating - ${game.MinimumDifficultyRating}\n`;
                rules += `Maximum Difficulty Rating - ${game.MaximumDifficultyRating}\n`;
                rules += `Maximum Song Length - ${game.MaximumSongLength}\n`;
                rules += `Minimum LN% - ${game.MinimumLongNotePercentage}%\n`;
                rules += `Maximum LN% - ${game.MaximumLongNotePercentage}%\n`;
                rules += `Allowed Game Modes - ${game.AllowedGameModes.join(", ")}\n`;
                rules += `Free Mod Type - ${game.FreeModType}\n`;
                rules += `Health Type - ${game.HealthType}\n`;
                rules += `Lives - ${game.Lives}`;

                await Bot.SendMessage(game.GetChatChannelName(), rules);
                break;
            case "hostrotation":
                if (!sender.CurrentGame.Host)
                    return;
                    
                game.ChangeAutoHostRotation(!game.AutoHostRotation);
                await Bot.SendMessage(game.GetChatChannelName(), `Auto Host Rotation is now turned ${(game.AutoHostRotation ? "on" : "off")}.`);
                break;
            case "ruleset":
                if (!sender.CurrentGame.Host)
                    return;

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
                    default:
                        await Bot.SendMessage(game.GetChatChannelName(), "You must specify either `team` or `freeforall`.");
                        break;
                }
                break;
            case "lnmin":
                if (!sender.CurrentGame.Host)
                    return;        
                    
                if (args.length < 2)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You must specify the minimum long note percentage.");

                const percent = parseInt(args[1]);

                if (isNaN(percent) || percent < 0 || percent > 100)
                    return await Bot.SendMessage(game.GetChatChannelName(), "Minimum long note percentage must be a number betwen 0-100%.");

                if (percent > game.MaximumLongNotePercentage)
                    return await Bot.SendMessage(game.GetChatChannelName(), `Minimum long note percentage must not be greater than the maximum: ${game.MaximumLongNotePercentage}%.`);

                game.ChangeMinimumLongNotePercentage(percent);
                await Bot.SendMessage(game.GetChatChannelName(), `Minimum long note percentage has been changed to: ${game.MinimumLongNotePercentage}%.`);     
                break;
            case "lnmax":
                if (!sender.CurrentGame.Host)
                    return;    
                    
                if (args.length < 2)
                    return await Bot.SendMessage(game.GetChatChannelName(), "You must specify the maximum long note percentage.");

                const maxPercent = parseInt(args[1]);

                if (isNaN(maxPercent) || maxPercent < 0 || maxPercent > 100)
                    return await Bot.SendMessage(game.GetChatChannelName(), "Maximum long note percentage must be a number betwen 0-100%.");

                if (maxPercent < game.MinimumLongNotePercentage)
                    return await Bot.SendMessage(game.GetChatChannelName(), `Maximum long note percentage must not be lower than the minimum: ${game.MinimumLongNotePercentage}%.`);

                game.ChangeMaximumLongNotePercentage(maxPercent);
                await Bot.SendMessage(game.GetChatChannelName(), `Maximum long note percentage has been changed to: ${game.MaximumLongNotePercentage}%.`);    
                break;
            case "maxplayers":
                if (!sender.CurrentGame.Host)
                    return;    
                    
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
                break;
        }
    }
}