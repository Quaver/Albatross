import User from "./rooster/User";
import ClientPacketCreateGame from "../packets/client/ClientPacketCreateGame";
import Logger from "../logging/Logger";
import MultiplayerGame from "../multiplayer/MultiplayerGame";
import MultiplayerGameType from "../multiplayer/MultiplayerGameType";
import Lobby from "../multiplayer/Lobby";
import DiscordWebhookHelper from "../discord/DiscordWebhookHelper";
import * as Discord from "discord.js";
import Albatross from "../Albatross";
import ServerPacketMultiplayerGameInfo from "../packets/server/ServerPacketMultiplayerGameInfo";
import { Profanity } from "@2toad/profanity";
import ChatManager from "../chat/ChatManager";

export default class CreateGameHandler {
    /**
     * Handles when the user wants to create a multiplayer game
     * @param user 
     * @param packet 
     */
    public static async Handle(user: User, packet: ClientPacketCreateGame): Promise<void> {
        try {
            // First run a check to see if the user is in a multiplayer game.
            if (user.IsInMultiplayerGame()) {
                await user.LeaveMultiplayerGame();
                Logger.Warning(`${user.Username} (#${user.Id}) is in multiplayer game, but trying to create a new one. Leaving previous`);
            }

            if (!packet.Game)
                return Logger.Warning("Received game create packet without a game object.");

            if (!packet.Game.Name)
                return Logger.Warning(`${user.Username} (#${user.Id}) tried to create a game with an empty game name.`);

            if (!(packet.Game.Type in MultiplayerGameType))
                return Logger.Warning(`${user.Username} (#${user.Id}) tried to create a game with an invalid game type.`);

            if (packet.Game.Name.length > 50) {
                Logger.Warning(`${user.ToNameIdString()} created a game with too long of a name!`);
                packet.Game.Name = packet.Game.Name.substring(0, 50);
            }

            // Add profanity filter to game name
            packet.Game.Name = ChatManager.Profanity.censor(packet.Game.Name);

            const game: MultiplayerGame = MultiplayerGame.Create(MultiplayerGameType.Friendly, packet.Game.Name, packet.Game.Password, packet.Game.MaxPlayers, 
                packet.Game.MapMd5, packet.Game.MapId, packet.Game.MapsetId, packet.Game.Map, packet.Game.Ruleset, packet.Game.AutoHostRotation,
                packet.Game.GameMode, packet.Game.DifficultyRating, packet.Game.AllDifficultyRatings, packet.Game.JudgementCount, packet.Game.AlternativeMapMd5, user);

            // Just set the game to null to prevent accidental usage of it since we now have two games.
            packet.Game = null;
        
            Albatross.SendToUser(user, new ServerPacketMultiplayerGameInfo(game))
            
            // Set the host
            if (game.Type == MultiplayerGameType.Friendly)
                await game.ChangeHost(user);
                
            await Lobby.CreateGame(game);
            await user.JoinMultiplayerGame(game, game.Password);

            if (!DiscordWebhookHelper.EventsHook)
                return;
        
            const embed = new Discord.RichEmbed()
                .setAuthor(user.Username, user.AvatarUrl, `https://quavergame.com/profile/${user.Id}`)
                .setDescription(`Created multiplayer game: **"${game.Name}."**`)
                .setTimestamp()
                .setColor(0x32bcf5);

            await DiscordWebhookHelper.EventsHook.send(embed);
        } catch (err) {
            return Logger.Error(err);
        }
    }    
}