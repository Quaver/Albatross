import IUserIdToUserMap from "./maps/IUserIdToUserMap";
import User from "./User";
import Logger from "../logging/Logger";
import IUsernameToUserMap from "./maps/IUsernameToUserMap";
import ISocketTokenToUserMap from "./maps/ISocketTokenToUserMap";

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
     * Adds a user session to the store
     * @param user 
     */
    public AddUser(user: User): void {
        this.UserIdToUser[user.Id] = user;
        this.UsernameToUser[user.Username] = user;

        if (user.Socket)
            this.SocketToUser[user.Socket.token] = user;

        this.Count++;

        Logger.Success(`${user.Username} (#${user.Id}) [${user.SteamId}] <${user.Token}> has successfully logged in!`);
    }

    /**
     * Removes a session from the store
     * @param user 
     */
    public RemoveUser(user: User): void {
        delete this.UserIdToUser[user.Id];
        delete this.UsernameToUser[user.Username];

        if (user.Socket)
            delete this.SocketToUser[user.Socket.token];

        this.Count--;

        Logger.Info(`${user.Username} (#${user.Id}) [${user.SteamId}] <${user.Token}> has disconnected from the server.`);
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