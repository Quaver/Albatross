import Packet from "../Packet";
import { JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

@JsonProperty("ClientPacketGameStopCountdown")
export default class ClientPacketGameStopCountdown extends Packet { 
    public Id: PacketId = PacketId.ClientGameStopCountdown;
}