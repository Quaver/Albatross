import User from "../sessions/User";
import Albatross from "../Albatross";
import Privileges from "../enums/Privileges";
import UserGroups from "../enums/UserGroups";
import ChatChannel from "../chat/ChatChannel";
import ChatManager from "../chat/ChatManager";
import ServerPacketNotification from "../packets/server/ServerPacketNotification";
import ServerNotificationType from "../enums/ServerNotificationType";
const config = require("../config/config.json");

export default class QuaverBot {
    /**
     * The online user for the bot.
     */
    public static User: User | any = null;

    /**
     * Does initialiazation of the bot. Should only be called once 
     */
    public static async Initialize(): Promise<void> {
        QuaverBot.User = new User(null, config.chatBot.id, config.chatBot.steamId, config.chatBot.username, true, 0, "US", Privileges.Normal,
                        UserGroups.Normal | UserGroups.Bot | UserGroups.Admin, config.chatBot.avatarUrl);

        await Albatross.Instance.OnlineUsers.AddUser(QuaverBot.User);
    }

    /**
     * Responds to any bot commands in public chats
     */
    public static async HandlePublicMessageCommands(sender: User, channel: ChatChannel, message: string): Promise<void> {
        
        QuaverBot.HandleCommands(sender, channel.Name, message.split(" "));
    }

    /**
     * Responds to any bot messages in private chats
     */
    public static async HandlePrivateMessageCommands(sender: User, receiver: User, message: string): Promise<void> {
        if (receiver != QuaverBot.User)
            return;

        // We give the username of the sender here because we want confirmations to be sent
        // back to the user.
        QuaverBot.HandleCommands(sender, sender.Username, message.split(" "))
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
                await QuaverBot.ExecuteHelpCommand(sender, to, args);
                break;
            case "discord":
                await QuaverBot.ExecuteDiscordCommand(sender, to, args);
                break;
            case "commands":
                await QuaverBot.ExecuteCommandsCommand(sender, to, args);
                break;
            case "skins":
                await QuaverBot.ExecuteSkinsCommand(sender, to, args);
                break;
            case "gameplay":
                await QuaverBot.ExecuteGameplayCommand(sender, to, args);
                break;
            case "offtopic":
                await QuaverBot.ExecuteOfftopicCommand(sender, to, args);
                break;
            case "spam":
                await QuaverBot.ExecuteSpamCommand(sender, to, args);
                break;
            case "bugs":
            case "issues":
            case "features":
            case "github":
                await QuaverBot.ExecuteGithubCommand(sender, to, args);
            case "kick":
                await QuaverBot.ExecuteKickCommand(sender, to, args);
                break;
            case "ban":
                await QuaverBot.ExecuteBanCommand(sender, to, args);
                break;
            case "alertall":
            case "notifyall":
                await QuaverBot.ExecuteNotifyAllCommand(sender, to, args);
                break;
            case "alertuser":
            case "notifyuser":
                await QuaverBot.ExecuteNotifyUserCommand(sender, to, args);
                break;
            case "roll":
                await QuaverBot.ExecuteRollCommand(sender, to, args);
                break;
            case "unmute":
                await QuaverBot.ExecuteUnmuteCommand(sender, to, args);
                break;
            case "mute":
                await QuaverBot.ExecuteMuteCommand(sender, to, args);
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
        await QuaverBot.SendMessage(to, `Hey there, ${sender.Username}! I'm ${QuaverBot.User.Username}, a bot that's here to help!\n\n` + 
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
        await QuaverBot.SendMessage(to, `You can join our Discord at the following link: https://discord.gg/nJa8VFr`);
    }

     /**
     * Executes the !commands command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteCommandsCommand(sender: User, to: string, args: string[]): Promise<void> {
        await QuaverBot.SendMessage(to, `You can view the list of commands at: https://quavergame.com/wiki/Commands`);
    }

     /**
     * Executes the !skins command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteSkinsCommand(sender: User, to: string, args: string[]): Promise<void> {
        await QuaverBot.SendMessage(to, `You can learn more about skinning at: https://quavergame.com/wiki/Skins`);
    }

     /**
     * Executes the !gameplay command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteGameplayCommand(sender: User, to: string, args: string[]): Promise<void> {
        await QuaverBot.SendMessage(to, `You can learn more about gameplay at: https://quavergame.com/wiki/Gameplay`);
    }

    /**
     * Executes the !offtopic command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteOfftopicCommand(sender: User, to: string, args: string[]): Promise<void> {
        await QuaverBot.SendMessage(to, `Please keep the discussion on-topic to avoid a mute.`);
    }

    /**
     * Executes the !spam command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteSpamCommand(sender: User, to: string, args: string[]): Promise<void> {
        await QuaverBot.SendMessage(to, `Please do not spam the chat to avoid a mute.`);
    }

    /**
     * Executes the !github command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteGithubCommand(sender: User, to: string, args: string[]): Promise<void> {
        await QuaverBot.SendMessage(to, `You can report bugs, request new features, or help out with development on Github: https://github.com/Quaver/Quaver`);
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
            return await QuaverBot.SendMessage(to, `Invalid command usage. Try using it like: "!kick <user_name> <reason>"`);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await QuaverBot.SendMessage(to, `Could not kick: "${targetUsername}" because they are offline.`);

        if (target == QuaverBot.User)
            return QuaverBot.SendIdiotMessage(to);

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
            return await QuaverBot.SendMessage(to, `Invalid command usage. Try using it like: "!ban <user_name> <reason>"`);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await QuaverBot.SendMessage(to, `Could not ban: "${targetUsername}" because they are offline.`);

        if (target == QuaverBot.User)
            return QuaverBot.SendIdiotMessage(to);

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
            return await QuaverBot.SendMessage(to, `Invalid command usage. Try using it like: "!notifyall <message>"`);

        const message: string = args.join(" ");

        Albatross.Broadcast(new ServerPacketNotification(ServerNotificationType.Info, message));
        await QuaverBot.SendMessage(to, `Successfully notified all users with message: ${message}`);
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
            return await QuaverBot.SendMessage(to, `Invalid command usage. Try using it like: "!notifyuser <user_name> <message>"`);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await QuaverBot.SendMessage(to, `Could not notify: "${targetUsername}" because they are offline.`);

        if (target == QuaverBot.User)
            return QuaverBot.SendIdiotMessage(to);

        args.shift();
        
        const message: string = args.join(" ");

        Albatross.SendToUser(target, new ServerPacketNotification(ServerNotificationType.Info, message));
        await QuaverBot.SendMessage(to, `Successfully notified ${target.Username} with message: ${message}`);
    }

     /**
     * Executes the !roll command
     * @param sender 
     * @param to 
     * @param args 
     */
    private static async ExecuteRollCommand(sender: User, to: string, args: string[]): Promise<void> {
        const rng: number = Math.floor((Math.random() * 100) + 0);
        await QuaverBot.SendMessage(to, `${sender.Username} has rolled a ${rng}!`);
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
            return await QuaverBot.SendMessage(to, `Invalid command usage. Try using it like: "!unmute <user_name>"`);

        const targetUsername: string = args[0].replace(/_/g, " ");
        const target: User = Albatross.Instance.OnlineUsers.GetUserByUsername(targetUsername);

        if (!target)
            return await QuaverBot.SendMessage(to, `Could not unmute: "${targetUsername}" because they are offline.`);

        if (target == QuaverBot.User)
            return QuaverBot.SendIdiotMessage(to);

        args.shift();

        await target.Unmute();
        await QuaverBot.SendMessage(to, `Successfully unmuted: ${target.Username}`);
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
    }

    /**
     * Sends a bot by QuaverBot
     * @param to 
     * @param message 
     */
    private static async SendMessage(to: string, message: string): Promise<void> {
        await ChatManager.SendMessage(QuaverBot.User, to, message);
    } 

    /**
     * OK
     */
    private static async SendIdiotMessage(to: string): Promise<void> {
        await QuaverBot.SendMessage(to, `Stop and think about what you're doing with your life right now.`);
    }
}