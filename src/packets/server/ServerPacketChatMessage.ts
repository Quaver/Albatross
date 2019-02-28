import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonProperty, JsonObject } from "json2typescript";
import User from "../../sessions/User";

@JsonObject("ServerPacketChatMessage")
export default class ServerPacketChatMessage extends Packet {

    public Id: PacketId = PacketId.ServerChatMessage;

    @JsonProperty("sid")
    public SenderId: number;

    @JsonProperty("u")
    public SenderName: string;

    @JsonProperty("to")
    public To: string;

    @JsonProperty("m")
    public Message: string;

    @JsonProperty("ts")
    public Time: number;

    constructor(sender: User, to: string, message: string) {
        super();

        this.SenderId = sender.Id;
        this.SenderName = sender.Username;
        this.To = to;
        this.Message = message;
        this.Time = Date.now();
    }
}