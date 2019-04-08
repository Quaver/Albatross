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
import MultiplayerGame from "../multiplayer/MutliplayerGame";
import MultiplayerGameType from "../multiplayer/MultiplayerGameType";
import MultiplayerGameRuleset from "../multiplayer/MultiplayerGameRuleset";
import GameMode from "../enums/GameMode";
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
    private static async SendMessage(to: string, message: string): Promise<void> {
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
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;              

                sender.CurrentGame.Start();
                break;
            // Starts the match countdown
            case "startcountdown":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;              

                sender.CurrentGame.StartMatchCountdown();
                break;
            // Ends the match
            case "end":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;  
                 
                sender.CurrentGame.End();         
                break;       
            case "stopcountdown":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;

                sender.CurrentGame.StopMatchCountdown();
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
                    sender.CurrentGame.ChangeHost(target);
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
            case "maxlength":
                if (!sender.CurrentGame.Host || args.length < 2)
                    return;

                const length = parseInt(args[1]);

                if (isNaN(length) || length <= 0)
                    return await Bot.SendMessage(game.GetChatChannelName(), "The maximum length must be greater than 0 seconds.");

                game.ChangeMaximumSongLength(length);
                await Bot.SendMessage(game.GetChatChannelName(), `The maximum length allowed for this game has been changed to: ${length} seconds.`);
                break;
        }
    }
}