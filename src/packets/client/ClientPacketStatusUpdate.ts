import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import UserStats from "../../sessions/UserStats";
import UserClientStatus from "../../objects/UserClientStatus";

@JsonObject("ClientPacketStatusUpdate")
export default class ClientPacketStatusUpdate extends Packet {
    
    public Id: PacketId = PacketId.ClientStatusUpdate;

    @JsonProperty("st")
    public Status: UserClientStatus | undefined;
}