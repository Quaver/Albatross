import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";
import Logger from "../../logging/Logger";
import SqlDatabase from "../../database/SqlDatabase";

@JsonObject("ServerPacketTwitchConnection")
export default class ServerPacketTwitchConnection extends Packet {
    public Id: PacketId = PacketId.ServerTwitchConnection;

    @JsonProperty("c")
    public Connected: boolean;

    @JsonProperty("u")
    public TwitchUsername: string | null;
    
    /**
     * @param connected 
     * @param username 
     */
    private constructor(connected: boolean, username: string | null) {
        super();

        this.Connected = connected;
        this.TwitchUsername = username;
    }

    /**
     * Returns a packet with the user's twitch connection status
     */
    public static async Create(user: User): Promise<ServerPacketTwitchConnection> {
        try {
            const result = await SqlDatabase.Execute("SELECT twitch_username FROM users WHERE id = ? LIMIT 1", [user.Id]);

            if (result.length == 0)
                throw new Error("User could not be found!");

            let username = result[0].twitch_username;

            if (username == "")
                username = null;

            return new ServerPacketTwitchConnection(username != null, username);
        } catch (err) {
            Logger.Error(err);
            return new ServerPacketTwitchConnection(false, null);
        }
    }
}