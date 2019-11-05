import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import Game from "../../enums/Game";

@JsonObject("ServerPacketSongRequest")
export default class ServerPacketSongRequest extends Packet {
    public Id: PacketId = PacketId.ServerSongRequest;

    /**
     * If the request is coming from Twitch, this'll be the username
     * of the requester. UserId should be -1
     */
    @JsonProperty("tw")
    public TwitchUsername: string;

    /**
     * If the request is coming from a Quaver user, this'll be the id of that
     * user who made the request
     */
    @JsonProperty("u")
    public UserId: number;

    @JsonProperty("g")
    public Game: Game;

    @JsonProperty("mid")
    public MapId: number;

    @JsonProperty("msid")
    public MapsetId: number;

    @JsonProperty("md5")
    public MapMd5: string | null;

    @JsonProperty("a")
    public Artist: string | null;

    @JsonProperty("t")
    public Title: string | null;

    @JsonProperty("d")
    public DifficultyName: string | null;

    @JsonProperty("c")
    public Creator: string | null;

    @JsonProperty("r")
    public DifficultyRating: number;

    constructor(twitchUsername: string, userId: number, game: Game, mapId: number, mapsetId: number, mapMd5: string | null, artist: string | null,
    title: string | null, difficultyName: string | null, creator: string | null, difficultyRating: number) {
        super();

        this.TwitchUsername = twitchUsername;
        this.UserId = userId;
        this.Game = game;
        this.MapId = mapId;
        this.MapsetId = mapsetId;
        this.MapMd5 = mapMd5;
        this.Artist = artist;
        this.Title = title;
        this.DifficultyName = difficultyName;
        this.Creator = creator;
        this.DifficultyRating = difficultyRating;
    }
}