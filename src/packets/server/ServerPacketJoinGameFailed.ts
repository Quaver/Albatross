import Packet from "../Packet";
import PacketId from "../PacketId";
import { JsonObject, JsonProperty } from "json2typescript";
import JoinGameFailureReason from "../../enums/JoinGameFailureReason";

@JsonObject("ServerPacketJoinGameFailed")
export default class ServerPacketJoinedGameFailed extends Packet {

    public Id: PacketId = PacketId.ServerJoinGameFailed;

    @JsonProperty("r")
    public Reason: JoinGameFailureReason

    constructor(reason: JoinGameFailureReason) {
        super();
        this.Reason = reason;
    }
}

