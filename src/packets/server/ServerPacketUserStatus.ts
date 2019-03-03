import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ServerPacketUserStatus")
export default class ServerPacketUserStatus extends Packet {

    public Id: PacketId = PacketId.ServerUserStatus;

    /**
     *  Dictionary of user statuses.
     *  userId:UserClientStatus
     */
    @JsonProperty("st")
    public UserStatuses: object;

    constructor(statuses: object) {
        super();
        
        this.UserStatuses = statuses;
    }
}