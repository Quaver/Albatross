import IPacketWritable from "../packets/IPacketWritable";
import { JsonObject, JsonProperty } from "json2typescript";
import User from "../handlers/rooster/User";
import UserGroups from "../enums/UserGroups";
import * as Discord from "discord.js";

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
    
    public DiscordWebhook: Discord.WebhookClient | null;

    constructor(name: string, description: string, userGroups: UserGroups, isModerated: boolean, autojoin: boolean, 
        discordWebhook: Discord.WebhookClient | null = null) {

        this.Name = name;
        this.Description = description;
        this.AllowedUserGroups = userGroups;
        this.IsModerated = isModerated;
        this.Autojoin = autojoin;
        this.DiscordWebhook = discordWebhook;
    }

    /**
     * Returns if the user is allowed to join the chat channel.
     * @param user 
     */
    public static IsUserAllowed(chan: ChatChannel, user: User): boolean {
        return (user.UserGroups & chan.AllowedUserGroups) != 0;
    }
}