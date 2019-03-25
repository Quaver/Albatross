import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import GameMode from "../../enums/GameMode";

@JsonObject("ClientPacketChangeGameMap")
export default class ClientPacketChangeGameMap extends Packet {

    public Id: PacketId = PacketId.ClientChangeGameMap;

    /**
     * The Md5 hash of the map
     */
    @JsonProperty("md5")
    public MapMd5: string = "";

    /**
     * The ID of the map
     */
    @JsonProperty("mid")
    public MapId: number = -1;
    
    /**
     * The mapset id of the map.
     */
    @JsonProperty("msid")
    public MapsetId: number = -1;

    /**
     * The title of the map.
     */
    @JsonProperty("map")
    public Map: string = "";

    /**
     * The game mode for the currently selected map
     */
    @JsonProperty("gm")
    public GameMode: GameMode = GameMode.Keys4;

    /**
     * The difficulty rating of the currently selected map.
     */
    @JsonProperty("d")
    public DifficultyRating: number = 0;
}