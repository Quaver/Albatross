import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketSpectateMultiplayerGame")
export default class ClientPacketSpectateMultiplayerGame extends Packet {
    public Id: PacketId = PacketId.ClientSpectateMultiplayerGame;

    @JsonProperty("gid")
    public GameId: string = "";

    @JsonProperty("p")
    public Password: string = "";
}