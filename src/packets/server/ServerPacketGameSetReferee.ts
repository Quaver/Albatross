import Packet from "../Packet";
import { JsonObject } from "json2typescript";
import PacketId from "../PacketId";
import MultiplayerGame from "../../multiplayer/MultiplayerGame";

@JsonObject("ServerPacketGameSetReferee")
export default class ServerPacketGameSetReferee extends Packet {
    public Id: PacketId = PacketId.ServerGameSetReferee;

    public UserId: number;

    constructor(game: MultiplayerGame) {
        super();
        this.UserId = game.RefereeUserId;
    }
}