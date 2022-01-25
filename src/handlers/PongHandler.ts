import SqlDatabase from "../database/SqlDatabase";
import Logger from "../logging/Logger";
import ClientPacketPong from "../packets/client/ClientPacketPong";
import User from "../sessions/User";
import * as Discord from "discord.js";
import DiscordWebhookHelper from "../discord/DiscordWebhookHelper";
const crypto = require('crypto');

export default class PongHandler {
    /**
     * Handles when a user sends pongs
     * @constructor
     */
    public static async Handle(user: User, packet: ClientPacketPong): Promise<void> {
        try {
            user.LastPongTime = Date.now();

            if (!packet.ProcessList)
                return;
               
            const trackedProcesses = await SqlDatabase.Execute("SELECT * FROM processes", []);
            const userProcesses = packet.ParseProcessList().Processes;
            const detectedProcessIds: number[] = [];
            const detectedProcesses: any[] = [];

            for (let i = 0; i < trackedProcesses.length; i++) {
                const process = trackedProcesses[i];
                const hashedName = crypto.createHash('md5').update(process.name.toLowerCase()).digest('hex');
            
                for (let j = 0; j < userProcesses.length; j++) {
                    const userProcess = userProcesses[j];

                    if (userProcess.Name == hashedName || userProcess.WindowTitle == hashedName || userProcess.FileName == hashedName) {
                        if (!detectedProcessIds.includes(process.id)) {
                            detectedProcessIds.push(process.id);
                            detectedProcesses.push(process);
                        }
                    }
                }
            }

            if (detectedProcesses.length == 0) {
                user.LastDetectedProcesses = [];
                return;
            }

            // Running processes are the same as the last time it was provided.
            if (JSON.stringify(detectedProcesses) == JSON.stringify(user.LastDetectedProcesses))
                return;

            user.LastDetectedProcesses = detectedProcesses;

            let str: string = "";
            detectedProcesses.forEach(x => str += `• **${x.id}. ${x.name}**\n`);

            const embed = new Discord.RichEmbed()
                .setAuthor(user.Username, user.AvatarUrl, `https://quavergame.com/profile/${user.Id}`)
                .setDescription(`❌ **Anti-cheat Triggered!**`)
                .addField("Detected Processes", str, false)
                .addField("Admin Actions", `[View Profile](https://quavergame.com/profile/${user.Id}) | ` + 
                                            `[Ban User](https://a.quavergame.com/ban/${user.id}) | ` + 
                                            `[Edit User](https://a.quavergame.com/edituser/${user.Id})`, false)
                .setTimestamp()
                .setThumbnail("https://i.imgur.com/DkJhqvT.jpg")
                .setFooter("Quaver", "https://i.imgur.com/DkJhqvT.jpg")
                .setColor(0xFF0000);

            await DiscordWebhookHelper.AnticheatWebhook.send(embed);
        } catch (err) {
            Logger.Error(err);
        }
    }
}