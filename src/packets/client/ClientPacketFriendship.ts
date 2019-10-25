import Packet from "../Packet";
import FriendsListAction from "../../enums/FriendsListAction";
import { JsonObject, JsonProperty } from "json2typescript";
import PacketId from "../PacketId";

export default class ClientPacketFriendship extends Packet {
    public Id: PacketId = PacketId.ClientFriendship;

    @JsonProperty("a")
    public Action: FriendsListAction = FriendsListAction.Add;

    @JsonProperty("u")
    public UserId: number = -1;
}