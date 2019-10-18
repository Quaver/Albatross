import ClientPacketListeningPartyChangeHost from "../client/ClientPacketListeningPartyChangeHost";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";

@JsonObject("ServerPacketListeningPartyChangeHost")
export default class ServerPacketListeningPartyChangeHost extends ClientPacketListeningPartyChangeHost {
    public Id: PacketId = PacketId.ServerListeningPartyChangeHost;

    constructor(userId: number) {
        super();

        this.UserId = userId;
        this.Id = PacketId.ServerListeningPartyChangeHost;
    }
}