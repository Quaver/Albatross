import Packet from "../Packet";
import { JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonProperty("ClientPacketGameHostSelectingMap")
export default class ClientPacketGameHostSelectingMap extends Packet {
    public Id: PacketId = PacketId.ClientGameHostSelectingMap;

    @JsonProperty("s")
    public IsSelecting : boolean = false;
}