import { JsonObject, JsonProperty } from "json2typescript";
import User from "../sessions/User";

@JsonObject("ListeningParty")
export default class ListeningParty {
    /**
     * The host of the listening party
     */
    public Host: User;

    /**
     * The id of the listening party host
     */
    @JsonProperty("h")
    public HostId: number;

    /**
     * The md5 hash of the map that is currently playing
     */
    @JsonProperty("md5")
    public MapMd5: string;

    /**
     * The id the of the map that is currently playing
     */
    @JsonProperty("mid")
    public MapId: number;

    /**
     * The timestamp in which the song has started
     */
    @JsonProperty("st")
    public SongStartTime: number = -1;

    /**
     * The timestamp in which the song will end
     */
    @JsonProperty("et")
    public SongEndTime: number = -1;

    /**
     * @param user 
     */
    constructor(user: User, md5: string, mapId: number) {
        this.Host = user;
        this.HostId = this.Host.Id;
        this.MapMd5 = md5;
        this.MapId = mapId;
    }
}