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

    @JsonProperty("amd5")
    public AlternativeMd5: string = "";

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
     * All difficulty ratings that were provided to us for each mod
     */
    @JsonProperty("adr")
    public AllDifficultyRatings: number[] = [];

    @JsonProperty("jc")
    public JudgementCount: number;

    /**
     * @param md5 
     * @param mapId 
     * @param mapsetId 
     * @param map 
     * @param mode 
     * @param difficultyRating 
     */
    constructor(md5: string, mapId: number, mapsetId: number, map: string, mode: GameMode, difficultyRating: number, allDifficultyRatings: number[], 
        judgementCount: number, alternativeMd5: string) {
        super();

        this.MapMd5 = md5;
        this.MapId = mapId;
        this.MapsetId = mapsetId;
        this.Map = map;
        this.GameMode = mode;
        this.DifficultyRating = difficultyRating;
        this.AllDifficultyRatings = allDifficultyRatings;
        this.JudgementCount = judgementCount;
        this.AlternativeMd5 = alternativeMd5;
    }
}