const execFile = require("child_process").execFile;
const cmd = require("node-cmd");

export default class CLI {
    /**
     * Executes a file from the command line.
     * @param path
     * @param args
     * @constructor
     */
    public static async ExecFile(path: string,  args: string[]): Promise <any> {
        return new Promise((resolve, reject) => {
            execFile(path, args, (err: any, data: any) => {
                if(err)
                    return reject(err);
                else
                    return resolve(data);
            });
        });
    }

    /**
     * Runs a command.
     * @param command
     * @constructor
     */
    public static Run(command: string): void {
        cmd.run(command);
    }

    /**
     * Runs a CLI command and gets the output.
     * @param command
     * @constructor
     */
    public static RunAndGetOutput(command: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cmd.get(command, (err: any, data: any, stderr: any) => {
                if (err)
                    return reject(err);
                
                resolve({
                    data,
                    stderr
                })
            });
        });
    }
}