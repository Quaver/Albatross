import ClientPacketStatusUpdate from "../packets/client/ClientPacketStatusUpdate";
import User from "./rooster/User";
import Logger from "../logging/Logger";
import RedisHelper from "../database/RedisHelper";
import Albatross from "../Albatross";
import ServerPacketUserStatus from "../packets/server/ServerPacketUserStatus";
import ClientStatus from "../enums/ClientStatus";

export default class ClientStatusUpdateHandler {
    /**
     * Handles when users update their client status
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketStatusUpdate): Promise<void> {
        if (!packet.Status)
            return Logger.Warning(`${user.Username} (#${user.Id}) sent a client status packet but without a status!`);

        user.CurrentStatus = packet.Status;

        const redisKey: string = `quaver:server:user_status:${user.Id}`;

        await RedisHelper.hset(redisKey, "s", Number(user.CurrentStatus.Status).toString());
        await RedisHelper.hset(redisKey, "m", Number(user.CurrentStatus.GameMode).toString());
        await RedisHelper.hset(redisKey, "c", user.CurrentStatus.Content);

        for (let i = 0; i < user.Spectators.length; i++)
            Albatross.SendToUser(user.Spectators[i], new ServerPacketUserStatus(user.GetSerializedStatus()));

        // Start a listening party for the user automatically if they're going to this screen
        if (user.ListeningParty == null && user.CurrentStatus.Status == ClientStatus.Listening)
            await user.StartListeningParty();
        // User left the screen, but they're still attached to a listening party, so exit out of it for them.
        else if (user.ListeningParty != null && user.CurrentStatus.Status != ClientStatus.Listening) {
            await user.LeaveListeningParty();
        }
    }
}