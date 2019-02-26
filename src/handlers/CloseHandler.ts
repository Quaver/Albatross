import Logger from "../logging/Logger";

export default class CloseHandler {
    /**
     * Handles when sockets close the connection from the server
     * @param socket
     * @constructor
     */
    public static async Handle(socket: any): Promise<void> {
        try {
            
        } catch (err) {
            Logger.Error(err);
        }
    }
}