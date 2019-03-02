import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ClientPacketRequestUserInfo")
export default class ClientPacketRequestUserInfo extends Packet {

    public Id: PacketId = PacketId.ClientRequestUserInfo;

    @JsonProperty("uids")
    public UserIds: number[] = [];
}