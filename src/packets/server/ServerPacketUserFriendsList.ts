import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import User from "../../sessions/User";

@JsonObject("ServerPacketUserFriendsList")
export default class ServerPacketUserFriendsList extends Packet {

    public Id: PacketId = PacketId.ServerUserFriendsList;

    @JsonProperty("u")
    public UserIds: number[];

    private constructor(userIds: number[]) {
        super();
        this.UserIds = userIds;
    }

    /**
     * Make an async factory method because we can't call async within the constructor
     * @param user 
     */
    public static async CreateAsync(user: User): Promise<ServerPacketUserFriendsList> {
        const friends = await user.GetFriendsList();
        return new ServerPacketUserFriendsList(friends);
    }
}