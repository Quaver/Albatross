import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty, Any } from "json2typescript";

@JsonObject("ClientPacketPong")
export default class ClientPacketPong extends Packet {
    /**
     */
    public Id: PacketId = PacketId.ClientPong;

    @JsonProperty("p", Any, true)
    public ProcessList: string = "";

    public ParseProcessList(): any {
        return JSON.parse(this.ProcessList);
    }
}