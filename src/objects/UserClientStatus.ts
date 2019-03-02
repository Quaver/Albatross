import { JsonObject, JsonProperty, JsonConvert } from "json2typescript";
import ClientStatus from "../enums/ClientStatus";
import GameMode from "../enums/GameMode";

@JsonObject("UserClientStatus")
export default class UserClientStatus implements IStringifyable {
    @JsonProperty("s")
    public Status: ClientStatus = ClientStatus.InMenus;

    @JsonProperty("mid")
    public MapId: number = -1;

    @JsonProperty("md5")
    public MapMd5: string = "";

    @JsonProperty("gm")
    public GameMode: GameMode = GameMode.Keys4;

    @JsonProperty("c")
    public Content: string = "";

    @JsonProperty("mods")
    public Modifiers: number = 0;

    public ToString(): string {
        const jsonConvert: JsonConvert = new JsonConvert();
        return JSON.stringify(jsonConvert.serializeObject(this));
    }
}