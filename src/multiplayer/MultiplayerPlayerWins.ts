import { JsonObject, JsonProperty } from "json2typescript";
import User from "../handlers/rooster/User";

@JsonObject("MultiplayerPlayerWins")
export default class MultiplayerPlayerWins { 
    @JsonProperty("u")
    public Id: number;

    @JsonProperty("w")
    public Wins: number;

    constructor(user: User, wins: number = 0) {
        this.Id = user.Id;
        this.Wins = wins;
    }
}