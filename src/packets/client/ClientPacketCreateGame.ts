import Packet from "../Packet";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MutliplayerGame";
import { JsonObject, JsonProperty } from "json2typescript";

@JsonObject("ClientPacketCreateGame")
export default class ClientPacketCreateGame extends Packet {

    public Id: PacketId = PacketId.ClientCreateGame;

    @JsonProperty("g")
    public Game: MultiplayerGame | null = null;
}