import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import ServerNotificationType from "../../enums/ServerNotificationType";

@JsonObject("ServerPacketNotification")
export default class ServerPacketNotification extends Packet {

    public Id: PacketId = PacketId.ServerNotification;

    @JsonProperty("t")
    public Type: ServerNotificationType; 

    @JsonProperty("c")
    public Content: string

    constructor(type: ServerNotificationType, message: string) {
        super();

        this.Type = type;
        this.Content = message;
    }
}