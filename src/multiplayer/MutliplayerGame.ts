import { JsonObject, JsonProperty } from "json2typescript";
import * as _ from "lodash";
import User from "../sessions/User";
import MultiplayerGameType from "./MultiplayerGameType";
import Albatross from "../Albatross";
import ServerPacketChangeGameHost from "../packets/server/ServerPacketChangeGameHost";
import Lobby from "./Lobby";
import ServerPacketMultiplayerGameInfo from "../packets/server/ServerPacketMultiplayerGameInfo";
import MultiplayerGameRuleset from "./MultiplayerGameRuleset";
import GameMode from "../enums/GameMode";
import ServerPacketGameMapChanged from "../packets/server/ServerPacketGameMapChanged";
import ServerPacketGameStart from "../packets/server/ServerPacketGameStart";
import ServerPacketGameEnded from "../packets/server/ServerPacketGameEnded";
import ServerPacketAllPlayersSkipped from "../packets/server/ServerPacketGameAllPlayersSkipped";
import ServerPacketGamePlayerReady from "../packets/server/ServerPacketGamePlayerReady";
import ServerPacketGamePlayerNotReady from "../packets/server/ServerPacketGamePlayerNotReady";
import Logger from "../logging/Logger";
import ServerPacketGameStartCountdown from "../packets/server/ServerPacketGameStartCountdown";
import ServerPacketGameStopCountdown from "../packets/server/ServerPacketGameStopCountdown";
const md5 = require("md5");

@JsonObject("MultiplayerGame")
export default class MultiplayerGame {
    /**
     * A unique identifier for the game
     */
    @JsonProperty("id")
    public Id: string = "";

    /**
     * The type of multiplayer game this is.
     */
    @JsonProperty("t")
    public Type: MultiplayerGameType = MultiplayerGameType.Friendly;

    /**
     * The name of the game
     */
    @JsonProperty("n")
    public Name: string = "";

    /**
     * The password for the game, if any
     */
    public Password: string | null = null;

    /**
     * If the game has a password on it
     */
    @JsonProperty("hp")
    public HasPassword: boolean = false;

    /**
     * The maximum players allowed in the game
     */
    @JsonProperty("mp")
    public MaxPlayers: number = 16;

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
     * The ids of the players in the game
     */
    @JsonProperty("ps")
    public PlayerIds: number[] = [];

    /**
     * The id of the game host.
     */
    @JsonProperty("h")
    public HostId: number = -1;

    /**
     * The ruleset of the game (teams, ffa, etc.)
     */
    @JsonProperty("r")
    public Ruleset: MultiplayerGameRuleset = MultiplayerGameRuleset.Free_For_All;

    /**
     * Whether the server will control host rotation for the match
     */
    @JsonProperty("hr")
    public HostRotation: boolean = false;

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
     * Players in the match that don't have the current map
     */
    @JsonProperty("pwm")
    public PlayersWithoutMap: number[] = [];

    /**
     * If the match is currently in progress.
     */
    @JsonProperty("p")
    public InProgress: boolean = false;

    /**
     * List of all ready players (ids, and serialized).
     */
    @JsonProperty("pri")
    public PlayersReady: number[] = [];

    /**
     * Unix timestamp of the time the match start countdown has started
     */
    @JsonProperty("cst")
    public CountdownStartTime: number = -1;

    /**
     * The players that are currently in the game
     */
    public Players: User[] = [];

    /**
     * The host of the game, if any
     */
    public Host: User | null = null;

    /**
     * The players that the game has started with.
     */
    public PlayersGameStartedWith: User[] = [];

    /**
     * The amount of players that have finished the map.
     */
    public FinishedPlayers: User[] = [];

    /**
     * The amount of players in the match that have their gameplay screen loaded
     * and are ready to start.
     * 
     * When all PlayersGameStartedWith has the same people as in this, 
     * the game will begin.
     * 
     * This is so everyone can begin the song at around the exact same time.
     */
    public PlayersWithGameScreenLoaded: User[] = [];

    /**
     * The players in the game that have requested to skip.
     */
    public PlayersSkipped: User[] = [];

    /**
     * If the match has already been skipped or not.
     */
    public MatchSkipped: boolean = false;

    /**
     * The physical countdown timeout handler.
     */
    public CountdownTimer: any;

    /**
     * Creates and returns a multiplayer game
     * @param type 
     * @param name 
     * @param password 
     * @param maxPlayers 
     * @param host 
     */
    public static Create(type: MultiplayerGameType, name: string, password: string | null, maxPlayers: number, mapMd5: string, 
        mapId: number, mapsetId: number, map: string, ruleset: MultiplayerGameRuleset, hostRotation: boolean, mode: GameMode, difficultyRating: number,
        host: User | null = null): MultiplayerGame {

        const game: MultiplayerGame = new MultiplayerGame();

        game.Type = type;
        game.Id = game.GenerateGameIdentifier();
        game.Name = name;
        game.Host = host;
        game.MaxPlayers = game.ClampMaxPlayers(maxPlayers);
        game.MapMd5 = mapMd5;
        game.MapId = mapId;
        game.MapsetId = mapsetId;
        game.Map = map;
        game.Ruleset = ruleset;
        game.HostRotation = hostRotation;
        game.GameMode = mode;
        game.DifficultyRating = difficultyRating;
        game.InProgress = false;
        game.Password = password;
        if (password) game.HasPassword = true;

        return game;
    }

    /**
     * Returns a unique identifier for this game.
     */
    private GenerateGameIdentifier(): string {
        return md5(Date.now() + this.Name + this.MaxPlayers + this.Type + this.HasPassword);
    }

    /**
     * Sets the maximum players allowed in the game.
     * 
     * Gives administrators the privilege to create massive games.
     * @param numPlayers 
     */
    private ClampMaxPlayers(numPlayers: number): number {
        if (this.Host && this.Host.IsDeveloper())
            return _.clamp(numPlayers, 2, 100);
        else
            return _.clamp(numPlayers, 2, 16);
    }
    
    /**
     * Returns if the game is full
     */
    public IsFull(): boolean {
        return this.Players.length == this.MaxPlayers;
    }

    /**
     * Changes the host of the game.
     * @param user 
     */
    public ChangeHost(user: User): void {
        this.Host = user;
        this.HostId = user.Id;

        Albatross.SendToUsers(this.Players, new ServerPacketChangeGameHost(user));
        this.InformLobbyUsers();
    } 

    /**
     * Changes the name of the game
     */
    public ChangeName(name: string): void {
        this.Name = name;

        // TODO: Send packet to users currently in the game.

        this.InformLobbyUsers();
    }

    /**
     * Changes the selected map of the game
     */
    public ChangeMap(md5: string, mapId: number, mapsetId: number, map: string, mode: GameMode, difficulty: number): void {
        this.MapMd5 = md5;
        this.MapId = mapId;
        this.MapsetId = mapsetId;
        this.Map = map;
        this.GameMode = mode;
        this.DifficultyRating = difficulty;

        this.PlayersWithoutMap = [];
        this.PlayersReady = [];
        Albatross.SendToUsers(this.Players, new ServerPacketGameMapChanged(md5, mapId, mapsetId, map, mode, difficulty));
        this.InformLobbyUsers();
    }

    /**
     * Changes the password of the game
     * @param password 
     */
    public ChangePassword(password: string | null): void {
        this.Password = password;
        this.HasPassword = password != null;


        // TODO: Send packet to users currently in the game.

        this.InformLobbyUsers();
    }

    /**
     * Starts the multiplayer game
     */
    public Start(): void {
        if (this.InProgress)
            return;

        Logger.Success(`[${this.Id}] Multiplayer Game Started!`);
        this.InProgress = true;
        this.PlayersGameStartedWith = this.Players.filter(x => !this.PlayersWithoutMap.includes(x.Id));
        this.FinishedPlayers = [];
        this.PlayersWithGameScreenLoaded = [];
        this.PlayersSkipped = [];
        this.PlayersReady = [];
        this.CountdownStartTime = -1;

        Albatross.SendToUsers(this.Players, new ServerPacketGameStart());
        this.InformLobbyUsers();
    }

    /**
     * Ends the multiplayer game
     */
    public End(): void {
        if (!this.InProgress)
            return;

        Logger.Success(`[${this.Id}] Multiplayer Game Ended!`);

        this.InProgress = false;
        this.MatchSkipped = false;
        this.PlayersGameStartedWith = [];
        this.FinishedPlayers = [];
        this.PlayersWithGameScreenLoaded = [];
        this.PlayersSkipped = [];
        this.PlayersReady = [];
        this.StopMatchCountdown();

        // Send packet to all users that the game has finished.
        Albatross.SendToUsers(this.Players, new ServerPacketGameEnded());
        this.InformLobbyUsers();
    }

    /**
     * Sends a packet to all users in the lobby that the settings/changes of/in the game has been updated.
     */
    public InformLobbyUsers(): void {
        Albatross.SendToUsers(Lobby.Users, new ServerPacketMultiplayerGameInfo(this));
    }

    /**
     * Informs all players that we're skipping the beginning of the song.
     */
    public HandleAllPlayersSkipped(): void {
        this.MatchSkipped = true;
        Albatross.SendToUsers(this.PlayersGameStartedWith, new ServerPacketAllPlayersSkipped());
    }

    /**
     * Starts the countdown before the game starts
     */
    public StartMatchCountdown(): void {
        if (this.CountdownStartTime != -1)
            return Logger.Warning(`[${this.Id}] Multiplayer Match Countdown Already Running (Cannot Start Again)`);
            
        Logger.Success(`[${this.Id}] Multiplayer Match Countdown Started`);

        this.CountdownStartTime = Date.now();
        this.CountdownTimer = setTimeout(() => this.Start(), 5000);

        Albatross.SendToUsers(this.Players, new ServerPacketGameStartCountdown(this.CountdownStartTime));
        this.InformLobbyUsers();
    }

    /**
     * Cancels the match countdown
     */
    public StopMatchCountdown(): void {
        if (this.CountdownStartTime == -1)
            return;

        Logger.Success(`[${this.Id}] Multiplayer Match Countdown Cancelled`);

        this.CountdownStartTime = -1;
        clearTimeout(this.CountdownTimer);

        Albatross.SendToUsers(this.Players, new ServerPacketGameStopCountdown());
        this.InformLobbyUsers();
    }

    /**
     * Informs all players in the game and the lobby that a player is ready.
     * @param user 
     */
    public InformPlayerIsReady(user: User): void {
        Albatross.SendToUsers(this.Players, new ServerPacketGamePlayerReady(user));
        this.InformLobbyUsers();
    }

    /**
     * Informs all players in the game and the lobby that a player isn't ready
     * @param user 
     */
    public InformPlayerNotReady(user: User): void {
        Albatross.SendToUsers(this.Players, new ServerPacketGamePlayerNotReady(user));
        this.InformLobbyUsers();
    }
}