import User from "../handlers/rooster/User";
import AdminActionLogType from "./AdminActionLogType";
import SqlDatabase from "../database/SqlDatabase";

export default class AdminActionLogger {
    /**
     * Adds an action log to the database
     * @param sender 
     * @param id 
     * @param type 
     * @param notes 
     */
    public static async Add(sender: User, target: User, type: AdminActionLogType, notes: string = ""): Promise<void> {
        await SqlDatabase.Execute("INSERT INTO admin_action_logs (author_id, author_username, target_id, target_username, action, notes, timestamp) " + 
            "VALUES (?, ?, ?, ?, ?, ?, ?)", [sender.Id, sender.Username, target.Id, target.Username, AdminActionLogType[type], notes, Date.now()]);
    }
}