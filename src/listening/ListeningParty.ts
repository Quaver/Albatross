import { JsonObject, JsonProperty } from "json2typescript";
import User from "../sessions/User";
import ClientPacketListeningPartyStateUpdate from "../packets/client/ClientPacketListeningPartyStateUpdate";
import Albatross from "../Albatross";
import ServerPacketListeningPartyStateUpdate from "../packets/server/ServerPacketListeningPartyStateUpdate";
import ServerPacketListeningPartyJoined from "../packets/server/ServerPacketListeningPartyJoin";
import ServerPacketListeningPartyLeft from "../packets/server/ServerPacketListeningPartyLeft";
import * as _ from "lodash";
import ServerPacketListeningPartyFellowJoined from "../packets/server/ServerPacketListeningPartyFellowJoined";
import ServerPacketListeningPartyFellowLeft from "../packets/server/ServerPacketListeningPartyFellowLeft";
import Logger from "../logging/Logger";
import ServerPacketListeningPartyChangeHost from "../packets/server/ServerPacketListeningPartyChangeHost";
import ListeningPartyAction from "./ListeningPartyAction";
import ServerPacketListeningPartyUserMissingSong from "../packets/server/ServerPacketListeningPartyUserMissingSong";
import ServerPacketListeningPartyUserHasSong from "../packets/server/ServerPacketListeningPartyUserHasSong";

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
     * The user ids of all the listeners
     */
    @JsonProperty("l")
    public ListenerIds: number[] = [];

    /**
     * The artist of the song
     */
    @JsonProperty("ar")
    public SongArtist: string = "";

    /**
     * The title of the song
     */
    @JsonProperty("ti")
    public SongTitle: string  = "";

    /**
     * The list of people who are currently listening in the party
     */
    public Listeners: User[] = [];

    /**
     * The listeners who don't have the currently acitve song
     */
    public ListenersWithoutSong: User[] = [];

    /**
     * The user ids of the listeners without the currently active song.
     */
    @JsonProperty("lws")
    public ListenerIdsWithoutSong: number[] = [];

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
        user.ListeningParty = this;

        this.Listeners.push(user);
        this.ListenerIds.push(user.Id);

        Albatross.SendToUser(user, new ServerPacketListeningPartyJoined(this));
        Albatross.SendToUsers(this.Listeners, new ServerPacketListeningPartyFellowJoined(user));
    }

    /**
     * Removes a listener to the list of 
     * @param user 
     */
    public async RemoveListener(user: User): Promise<void> {
        // Remove them from the list of listeners
        _.remove(this.Listeners, user);
        this.ListenerIds = this.ListenerIds.filter((x: number) => x != user.Id);

        // Make sure the user is removed from the users that don't have the active song
        _.remove(this.ListenersWithoutSong, user);
        this.ListenerIdsWithoutSong = this.ListenerIdsWithoutSong.filter((x: number) => x != user.Id);

        // Send a packet to the user that left.
        Albatross.SendToUser(user, new ServerPacketListeningPartyLeft());
        Albatross.SendToUsers(this.Listeners, new ServerPacketListeningPartyFellowLeft(user));

        if (this.Host == user && this.Listeners.length > 0)
            await this.ChangeHost(this.Listeners[0].Id);
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
        this.SongArtist = packet.SongArtist;
        this.SongTitle = packet.SongTitle;

        // On map change, reset the listeners who don't have the active song.
        if (packet.Action == ListeningPartyAction.ChangeSong) {
            this.ListenersWithoutSong = [];
            this.ListenerIdsWithoutSong = [];
        }

        // Relay this packet to all other listeners
        const relayPacket = new ServerPacketListeningPartyStateUpdate(packet.Action, packet.MapMd5, packet.MapId, packet.LastActionTime, 
            packet.SongTime, packet.IsPaused, packet.SongArtist, packet.SongTitle);

        Albatross.SendToUsers(this.Listeners, relayPacket);
    }

    /**
     * Changes the host of the listening party to a new user.
     * @param userId 
     */
    public async ChangeHost(userId: number): Promise<void> {
        const oldHost = this.Host;

        const user = this.Listeners.find((x: User) => x.Id == userId);

        if (!user)
            return Logger.Warning(`Tried to change host of ${this.Host.ToNameIdString()}'s listening party, but the user is not in the party!`);

        this.Host = user;
        this.HostId = user.Id;

        Albatross.SendToUsers(this.Listeners, new ServerPacketListeningPartyChangeHost(this.Host.Id))
        Logger.Info(`The host of ${oldHost.ToNameIdString()}'s listening party has been changed to: ${this.Host.ToNameIdString()}`);
    }

    /**
     * Kicks a user from the listening party
     * @param userId 
     */
    public async KickUser(userId: number): Promise<void> {
        const user = this.Listeners.find((x: User) => x.Id == userId);

        if (!user)
            return Logger.Warning(`Tried to kick: ${userId} from ${this.Host.ToNameIdString()}'s listening party, but the user is not in the party!`);

        await this.RemoveListener(user);
    }

    /**
     * Informs everyone in the party that this user is missing the active song.
     * @param user 
     */
    public async HandleUserMissingSong(user: User): Promise<void> {
        if (!this.Listeners.includes(user))
            return;

        if (!this.ListenersWithoutSong.includes(user))
            this.ListenersWithoutSong.push(user);

        if (!this.ListenerIdsWithoutSong.includes(user.Id))
            this.ListenerIdsWithoutSong.push(user.Id);

        Albatross.SendToUsers(this.Listeners, new ServerPacketListeningPartyUserMissingSong(user));
    }

    /**
     * Informs everyone in the party that a user has the active song
     * @param user 
     */
    public async HandleUserHasSong(user: User): Promise<void> {
        if (!this.Listeners.includes(user))
            return;

        // Make sure the user is removed from the users that don't have the active song
        _.remove(this.ListenersWithoutSong, user);
        this.ListenerIdsWithoutSong = this.ListenerIdsWithoutSong.filter((x: number) => x != user.Id);

        Albatross.SendToUsers(this.Listeners, new ServerPacketListeningPartyUserHasSong(user));
    }
}