import User from "../sessions/User";
import ClientPacketCreateGame from "../packets/client/ClientPacketCreateGame";
import Logger from "../logging/Logger";
import MultiplayerGame from "../multiplayer/MutliplayerGame";
import MultiplayerGameType from "../multiplayer/MultiplayerGameType";
import Lobby from "../multiplayer/Lobby";
import DiscordWebhookHelper from "../discord/DiscordWebhookHelper";
import * as Discord from "discord.js";

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
                user.LeaveMultiplayerGame();
                Logger.Warning(`${user.Username} (#${user.Id}) is in multiplayer game, but trying to create a new one. Leaving previous`);
            }

            if (!packet.Game)
                return Logger.Warning("Received game create packet without a game object.");

            if (!packet.Game.Name)
                return Logger.Warning(`${user.Username} (#${user.Id}) tried to create a game with an empty game name.`);

            if (!(packet.Game.Type in MultiplayerGameType))
                return Logger.Warning(`${user.Username} (#${user.Id}) tried to create a game with an invalid game type.`);

            const game: MultiplayerGame = MultiplayerGame.Create(packet.Game.Type, packet.Game.Name, packet.Game.Password, packet.Game.MaxPlayers, 
                packet.Game.MapMd5, packet.Game.MapId, packet.Game.MapsetId, packet.Game.Map, packet.Game.Ruleset, packet.Game.AutoHostRotation,
                packet.Game.GameMode, packet.Game.DifficultyRating);

            // Just set the game to null to prevent accidental usage of it since we now have two games.
            packet.Game = null;

            // Create the actual game.
            Lobby.CreateGame(game);
            user.JoinMultiplayerGame(game, game.Password);
            
            // Set the host
            if (game.Type == MultiplayerGameType.Friendly)
                game.ChangeHost(user);
                
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