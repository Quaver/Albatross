import ClientPacketListeningPartyStateUpdate from "../client/ClientPacketListeningPartyStateUpdate";
import PacketId from "../PacketId";
import ListeningPartyAction from "../../listening/ListeningPartyAction";

export default class ServerPacketListeningPartyStateUpdate extends ClientPacketListeningPartyStateUpdate {
    public Id: PacketId = PacketId.ServerListeningPartyStateUpdate;

    constructor(action: ListeningPartyAction, mapMd5: string, mapId: number, lastActionTime: number, songTime: number, isPaused: boolean) {
        super();

        this.Id = PacketId.ServerListeningPartyStateUpdate;
        
        this.Action = action;
        this.MapMd5 = mapMd5;
        this.MapId = mapId;
        this.LastActionTime = lastActionTime;
        this.SongTime = songTime;
        this.IsPaused = isPaused;
    }
}