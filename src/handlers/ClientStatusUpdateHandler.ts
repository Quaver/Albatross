import ClientPacketStatusUpdate from "../packets/client/ClientPacketStatusUpdate";
import User from "../sessions/User";
import Logger from "../logging/Logger";
import RedisHelper from "../database/RedisHelper";

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
    }
}