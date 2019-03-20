import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketJoinGame")
export default class ClientPacketJoinGame extends Packet {

    public Id: PacketId = PacketId.ClientJoinGame;

    @JsonProperty("gid")
    public GameId: string = "";

    @JsonProperty("p")
    public Password: string = "";
}