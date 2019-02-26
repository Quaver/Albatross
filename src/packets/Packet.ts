import PacketId from "./PacketId";
import {JsonProperty, JsonObject, JsonConvert} from "json2typescript";

@JsonObject("Packet")
export default abstract class Packet {
    /**
     * The id of the packet, first byte sent
     */
    @JsonProperty("id")
    public abstract Id: PacketId;
    
    /**
     * Turns the packet into a JSON string
     * @constructor
     */
    public ToString(): string {
        const jsonConvert: JsonConvert = new JsonConvert();
        return JSON.stringify(jsonConvert.serializeObject(this));
    }
}