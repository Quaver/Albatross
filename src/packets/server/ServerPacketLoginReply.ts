import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty, JsonConvert } from "json2typescript";
import User from "../../handlers/rooster/User";
import ModeToUserStatsMap from "../../sessions/ModeToUserStatsMap";
import GameMode from "../../enums/GameMode";

@JsonObject("ServerPacketLoginReply")
export default class ServerPacketLoginReply extends Packet {
    /**
     */
    public Id: PacketId = PacketId.ServerLoginReply;

    // In this case its an object because we don't want to serialize the entire 
    // user object. Just the portions that are actually important to all users.
    @JsonProperty("u")
    public User: object;

    @JsonProperty("t")
    public SessionToken: string | null

    @JsonProperty("s")
    public Stats: any = [];

    constructor(user: User) {
        super();

        this.User = user.Serialize();

        for (let mode in GameMode) {
            if (isNaN(Number(mode)))
                continue;

            this.Stats.push(JSON.parse(user.Stats[mode].ToString()));
        }

        this.SessionToken = user.Token;
    }
}