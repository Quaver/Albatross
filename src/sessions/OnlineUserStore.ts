import IUserIdToUserMap from "./maps/IUserIdToUserMap";
import User from "./User";
import Logger from "../logging/Logger";
import IUsernameToUserMap from "./maps/IUsernameToUserMap";
import ISocketTokenToUserMap from "./maps/ISocketTokenToUserMap";
import RedisHelper from "../database/RedisHelper";
import Albatross from "../Albatross";
import QuaverBot from "../bot/QuaverBot";
import ChatManager from "../chat/ChatManager";

export default class OnlineUserStore {
    /**
     * The number of users currently online.
     */
    public Count: number = 0;

    /**
     *  A map of users by their user ids.
     */
    private UserIdToUser: IUserIdToUserMap = {};

    /**
     * A map of users by their usernames.
     */
    private UsernameToUser: IUsernameToUserMap = {};

    /**
     * A map of users by their socket token
     */
    private SocketToUser: ISocketTokenToUserMap = {};

    /**
     * Array of all online users
     */
    public Users: User[] = [];

    /**
     * Adds a user session to the store
     * @param user 
     */
    public async AddUser(user: User): Promise<void> {
        this.UserIdToUser[user.Id] = user;
        this.UsernameToUser[user.Username] = user;
        this.Users.push(user);

        if (user.Socket)
            this.SocketToUser[user.Socket.token] = user;

        this.Count++;

        // Update redis online users and add user session.
        await RedisHelper.incr("quaver:server:online_users");

        if (user != QuaverBot.User)
            await RedisHelper.set(`quaver:server:session:${user.Token}`, user.Id.toString());

        Logger.Success(`${user.Username} (#${user.Id}) [${user.SteamId}] <${user.Token}> has successfully logged in!`);
        Logger.Info(`There are now: ${this.Count} users online.`);
    }

    /**
     * Removes a session from the store
     * @param user 
     */
    public async RemoveUser(user: User): Promise<void> {
        // Handle sockets that were never able to authenticate in the first place.
        if (!user)
            return;

        delete this.UserIdToUser[user.Id];
        delete this.UsernameToUser[user.Username];

        if (user.Socket)
            delete this.SocketToUser[user.Socket.token];

        this.Users = this.Users.filter(x => x != user);
        this.Count--;

        for (let i = 0; i < user.ChannelsJoined.length; i++) {
            const filteredChannelList: User[] = ChatManager.Channels[user.ChannelsJoined[i].Name].UsersInChannel.filter(x => x.Id != user.Id);
            ChatManager.Channels[user.ChannelsJoined[i].Name].UsersInChannel = filteredChannelList
        }

        // Update redis online users and add user session.
        await RedisHelper.set("quaver:server:online_users", this.Count.toString());
        await RedisHelper.del(`quaver:server:session:${user.Token}`);

        Logger.Info(`${user.Username} (#${user.Id}) [${user.SteamId}] <${user.Token}> has disconnected from the server.`);
        Logger.Info(`There are now: ${this.Count} users online.`);
    }

    /**
     *  Returns a user by their user id.
     * @param id G
     */
    public GetUserById(id: number): User {
        return this.UserIdToUser[id];
    } 

    /**
     * Returns an online user by their username
     * @param username 
     */
    public GetUserByUsername(username: string): User {
        return this.UsernameToUser[username];
    }

    /**
     * Gets a user by their socket token
     * @param socket 
     */
    public GetUserBySocket(socket: any): User {
        return this.SocketToUser[socket.token];
    }
}