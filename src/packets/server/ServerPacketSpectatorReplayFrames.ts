import ClientPacketSpectatorReplayFrames from "../client/ClientPacketSpectatorReplayFrames";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";
import SpectatorClientStatus from "../../enums/SpectatorClientStatus";
import User from "../../sessions/User";

@JsonObject("ServerPacketSpectatorReplayFrames")
export default class ServerPacketSpectatorReplayFrames extends ClientPacketSpectatorReplayFrames {
    public Id: PacketId = PacketId.ServerSpectatorReplayFrames;

    @JsonProperty("u")
    public UserId: number

    constructor(user: User, status: SpectatorClientStatus, audioTime: number, frames: string | null) {
        super();
        this.Id = PacketId.ServerSpectatorReplayFrames;
        this.UserId = user.Id;
        this.Status = status;
        this.AudioTime = audioTime;
        this.Frames = frames;
    }
}