import GameMode from "../enums/GameMode";
import IPacketWritable from "../packets/IPacketWritable";
import { JsonProperty, JsonObject, JsonConvert } from "json2typescript";

@JsonObject("UserStats")
export default class UserStats implements IStringifyable {
    @JsonProperty("m")
    public GameMode: GameMode;

    @JsonProperty("r")
    public Rank: number;

    @JsonProperty("cr")
    public CountryRank: number;

    @JsonProperty("ts")
    public TotalScore: number;

    @JsonProperty("rs")
    public RankedScore: number;

    @JsonProperty("oa")
    public OverallAccuracy: number;

    @JsonProperty("or")
    public OverallPerformanceRating: number;

    @JsonProperty("pc")
    public PlayCount: number;

    constructor(mode: GameMode, rank: number, countryRank: number, totalScore: number, rankedScore: number, overallAccuracy: number, 
        overallRating: number, playCount: number) {

        this.GameMode = mode;
        this.Rank = rank;
        this.CountryRank = countryRank;
        this.TotalScore = totalScore;
        this.RankedScore = rankedScore;
        this.OverallAccuracy = overallAccuracy;
        this.OverallPerformanceRating = overallRating;
        this.PlayCount = playCount;
    }

    public ToString(): string {
        const jsonConvert: JsonConvert = new JsonConvert();
        return JSON.stringify(jsonConvert.serializeObject(this));
    }
}