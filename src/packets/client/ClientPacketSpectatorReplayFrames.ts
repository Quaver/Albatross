import Packet from "../Packet";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import SpectatorClientStatus from "../../enums/SpectatorClientStatus";

@JsonObject("ClientPacketSpectatorReplayFrames")
export default class ClientPacketSpectatorReplayFrames extends Packet {
    public Id: PacketId = PacketId.ClientSpectatorReplayFrames;

    @JsonProperty("s")
    public Status: SpectatorClientStatus = SpectatorClientStatus.SelectingSong;

    @JsonProperty("a")
    public AudioTime: number = -1;

    @JsonProperty("f")
    public Frames: string | null = null;
}