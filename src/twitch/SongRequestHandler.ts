import Logger from "../logging/Logger";
import User from "../sessions/User";
import Albatross from "../Albatross";
import ServerPacketSongRequest from "../packets/server/ServerPacketSongRequest";
import Game from "../enums/Game";
import ServerPacketTwitchConnection from "../packets/server/ServerPacketTwitchConnection";

export default class SongRequestHandler {
    /**
     * Handles song requests that come in from Twitch
     * @param request 
     */
    public static async HandleTwitchSongRequest(request: any): Promise<void> {
        try {
            const user: User = Albatross.Instance.OnlineUsers.GetUserById(request.user_id);

            if (!user)
                return Logger.Warning(`Received Twitch song request for user #${request.user_id}, but they are not online!`);

            const song = request.request;

            const packet: ServerPacketSongRequest = new ServerPacketSongRequest(song.twitch_username, -1, song.game, 
                song.map_id, song.mapset_id, song.map_md5, song.artist, song.title, song.difficulty_name,
                song.creator, song.difficulty_rating);

            Albatross.SendToUser(user, packet);
        } catch (err) {
            Logger.Error(err);
        }
    }

    /**
     * Handle new twitch account connections
     * @param data 
     */
    public static async HandleTwitchConnection(data: any): Promise<void> {
        try {
            const user: User = Albatross.Instance.OnlineUsers.GetUserById(data.user_id);

            if (!user)
                return Logger.Warning(`Received successful twitch connection for: #${data.user_id}, but they are not online!`);

            const twitchConnectionPacket: ServerPacketTwitchConnection = await ServerPacketTwitchConnection.Create(user);
            Albatross.SendToUser(user, twitchConnectionPacket);
        } catch (err) {
            Logger.Error(err);
        }
    }
}