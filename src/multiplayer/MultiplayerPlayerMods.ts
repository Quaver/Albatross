import { JsonObject, JsonProperty } from "json2typescript";
import User from "../sessions/User";

@JsonObject("MultiplayerPlayerMods")
export default class MultiplayerPlayerMods {
    @JsonProperty("uid")
    public Id: number;

    @JsonProperty("m")
    public Mods: string;

    constructor(user: User, mods: string) {
        this.Id = user.Id;
        this.Mods = mods;
    }
}