import { JsonObject, JsonProperty } from "json2typescript";
import User from "../sessions/User";
import ClientPacketListeningPartyStateUpdate from "../packets/client/ClientPacketListeningPartyStateUpdate";
import Albatross from "../Albatross";
import ServerPacketListeningPartyStateUpdate from "../packets/server/ServerPacketListeningPartyStateUpdate";
import ServerPacketListeningPartyJoined from "../packets/server/ServerPacketListeningPartyJoin";
import ServerPacketListeningPartyLeft from "../packets/server/ServerPacketListeningPartyLeft";
import * as _ from "lodash";

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
     * The time the last action was performed
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

    /**
     * The list of people who are currently listening in the party
     */
    public Listeners: User[] = [];

    /**
     * @param user 
     */
    constructor(user: User, md5: string, mapId: number) {
        this.Host = user;
        this.HostId = this.Host.Id;
        this.MapMd5 = md5;
        this.MapId = mapId;

        this.AddListener(user);
    }

    /**
     * Adds a listeners to the list of users
     * @param user 
     */
    public async AddListener(user: User): Promise<void> {
        this.Listeners.push(user);

        // Send a packet to the listener that has joined
        Albatross.SendToUser(this.Host, new ServerPacketListeningPartyJoined(this));

        // TODO: Send a packet to all the other listeners that this user has joined
    }

    /**
     * Removes a listener to the list of 
     * @param user 
     */
    public async RemoveListener(user: User): Promise<void> {
        // Remove them from the list of listeners
        _.remove(this.Listeners, user);

        // Send a packet to the user that left.
        Albatross.SendToUser(user, new ServerPacketListeningPartyLeft());

        // TODO: Send to all other listeners that the user has left the party
        // TODO: If the host leaves, then transfer host to another user
    }

    /**
     * Updates the state of the listening party
     */
    public async UpdateState(packet: ClientPacketListeningPartyStateUpdate): Promise<void> {
        this.MapMd5 = packet.MapMd5;
        this.MapId = packet.MapId;
        this.LastActionTime = packet.LastActionTime;
        this.IsPaused = packet.IsPaused;
        this.SongTime = packet.SongTime;

        // Relay this packet to all other listeners
        const relayPacket = new ServerPacketListeningPartyStateUpdate(packet.Action, packet.MapMd5, packet.MapId, packet.LastActionTime, 
            packet.SongTime, packet.IsPaused);

        Albatross.SendToUsers(this.Listeners, relayPacket);
    }
}