import IPacketWritable from "../packets/IPacketWritable";
import { JsonObject, JsonProperty } from "json2typescript";
import User from "../sessions/User";
import UserGroups from "../enums/UserGroups";

@JsonObject("ChatChannel")
export default class ChatChannel {
    
    @JsonProperty("n")
    public Name: string;

    @JsonProperty("d")
    public Description: string;
    
    @JsonProperty("ug")
    public AllowedUserGroups: UserGroups;
    
    public IsModerated: boolean;

    public Autojoin: boolean;

    public UsersInChannel: User[] = [];
    
    constructor(name: string, description: string, userGroups: UserGroups, isModerated: boolean, autojoin: boolean) {
        this.Name = name;
        this.Description = description;
        this.AllowedUserGroups = userGroups;
        this.IsModerated = isModerated;
        this.Autojoin = autojoin;
    }

    /**
     * Returns if the user is allowed to join the chat channel.
     * @param user 
     */
    public static IsUserAllowed(chan: ChatChannel, user: User): boolean {
        return (user.UserGroups & chan.AllowedUserGroups) != 0;
    }
}