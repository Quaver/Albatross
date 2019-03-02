import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketRequestUserStatus")
export default class ClientPacketRequestUserStatus extends Packet {

    public Id: PacketId = PacketId.ClientRequestUserStatus;

    @JsonProperty("uids")
    public UserIds: number[] = [];
}