import { JsonProperty, JsonConvert } from "json2typescript";
import Packet from "../Packet";
import PacketId from "../PacketId";
import ListeningParty from "../../listening/ListeningParty";

@JsonProperty("ServerPacketListeningPartyJoined")
export default class ServerPacketListeningPartyJoined extends Packet {
    public Id: PacketId = PacketId.ServerListeningPartyJoined;

    @JsonProperty("lp")
    public ListeningParty: any

    constructor(party: ListeningParty) {
        super();

        const jsonConvert: JsonConvert = new JsonConvert();
        this.ListeningParty = jsonConvert.serializeObject(party);
    }
}