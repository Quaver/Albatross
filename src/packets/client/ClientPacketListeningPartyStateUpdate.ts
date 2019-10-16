import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import ListeningPartyAction from "../../listening/ListeningPartyAction";

@JsonObject("ClientPacketListeningPartyStateUpdate")
export default class ClientPacketListeningPartyStateUpdate extends Packet {
    public Id: PacketId = PacketId.ClientListeningPartyStateUpdate;

    /**
     * The action that was performed during this state update
     */
    @JsonProperty("a")
    public Action: ListeningPartyAction = ListeningPartyAction.ChangeSong;

    /**
     * The md5 hash of the map that is currently playing
     */
    @JsonProperty("md5")
    public MapMd5: string = "";

    /**
     * The id the of the map that is currently playing
     */
    @JsonProperty("mid")
    public MapId: number = -1;

    /**
     * Timestamp of when this state update was performed
     */
    @JsonProperty("lat")
    public LastActionTime: number = 0;    

    /**
     * The song time that occurred at see: LastActionTime
     */
    @JsonProperty("st")
    public SongTime: number = 0;

    /**
     * If the song is currently paused
     */
    @JsonProperty("p")
    public IsPaused: boolean = false;
}