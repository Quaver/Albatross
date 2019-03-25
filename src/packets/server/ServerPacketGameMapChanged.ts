import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import GameMode from "../../enums/GameMode";

@JsonObject("ServerPacketGameMapChanged")
export default class ServerPacketGameMapChanged extends Packet {

    public Id: PacketId = PacketId.ServerGameMapChanged;

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

    /**
     * @param md5 
     * @param mapId 
     * @param mapsetId 
     * @param map 
     * @param mode 
     * @param difficultyRating 
     */
    constructor(md5: string, mapId: number, mapsetId: number, map: string, mode: GameMode, difficultyRating: number) {
        super();

        this.MapMd5 = md5;
        this.MapId = mapId;
        this.MapsetId = mapsetId;
        this.Map = map;
        this.GameMode = mode;
        this.DifficultyRating = difficultyRating;
    }
}