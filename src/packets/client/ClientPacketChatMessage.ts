import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ClientChatMessagePacket")
export default class ClientPacketChatMessage extends Packet {

    public Id: PacketId = PacketId.ClientChatMessage;

    @JsonProperty("to")
    public To: string = "";

    @JsonProperty("m")
    public Message: string = "";
}