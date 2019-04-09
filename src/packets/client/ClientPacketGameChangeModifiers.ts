import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import ModIdentifiers from "../../enums/ModIdentifiers";

@JsonObject("ClientPacketGameChangeModifiers")
export default class ClientPacketGameChangeModifiers extends Packet { 
    public Id: PacketId = PacketId.ClientGameChangeModifiers;

    @JsonProperty("md")
    public Modifiers: string = "0";

    @JsonProperty("d")
    public DifficultyRating: number = 0;
}