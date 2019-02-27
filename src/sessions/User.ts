import IPacketWritable from "../packets/IPacketWritable";

export default class User implements IPacketWritable, IStringifyable {
    /**
     * The token that marks this user's session to the server
     */
    public Token: string | null;

    /**
     * The user's socket connection
     */
    public Socket: any;

    /**
     * The user's userid/
     */
    public Id: number;

    /**
     * The user's confirmed Steam Id
     */
    public SteamId: number;

    /**
     * The username of the user
     */
    public Username: string;

    /**
     * @param token 
     * @param steamId 
     * @param username 
     * @param socket 
     */
    constructor(socket: any, userId: number, steamId: number, username: string) {
        // For artifical users such as bots.
        if (socket)
            this.Token = socket.token;
        else
            this.Token = null;

        this.Socket = socket;
        this.Id = userId;
        this.SteamId = steamId;
        this.Username = username;
    }

    /**
     * Kicks the user from the server
     */
    public Kick(notify: boolean = false): void {
        this.Socket.close();
    }

    public Serialize(): object {
        return {
            id: this.Id,
            sid: this.SteamId,
            u: this.Username,
        }
    }

    public ToString(): string {
        return JSON.stringify(this);
    }
}