import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ClientPacketGameSongSkipped")
export default class ClientPacketGameSongSkipRequest extends Packet {
    public Id: PacketId = PacketId.ClientGameSongSkipRequest;
}