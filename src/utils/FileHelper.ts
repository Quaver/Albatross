import * as fs from "fs";
const extract = require("extract-zip");
const md5File = require("md5-file");
const rimraf = require("rimraf");

export default class FileHelper {
    /**
     * Promisifes file.mv() from express-fileupload
     * @param file
     * @param path
     * @constructor
     */
    public static Move(file: any, path: string): Promise<void> {
        return new Promise((resolve,  reject) => {
            file.mv(path, (err: any) => {
                if (err)
                    return reject(err);
                
                return resolve();
            });
        });
    }

    /**
     * Extracts a zip file to a given target path
     * @param file
     * @param targetPath
     */
    public static ExtractZip(file: string, targetPath: string): Promise<void> {
        return new Promise((resolve, reject) => {
            extract(file, { dir: targetPath }, (err: any) => {
                return (err) ? reject(err) : resolve();
            });
        });
    }

    /**
     * Creates a directory if it doesn't exist.
     * @param dir
     * @constructor
     */
    public static CreateDirectoryIfNotExists(dir: string) {
        if (!fs.existsSync(dir))
            fs.mkdirSync(dir);
    }

    /**
     * Gets the md5 hash of a file.
     * @param path
     * @constructor
     */
    public static Md5File(path: string): Promise<string> {
        return new Promise((resolve, reject) => {
            md5File(path, (err: any, hash: any) => {
                if (err)
                    return reject(err);

                return resolve(hash);
            })
        });
    }

    /**
     * Deletes an entire folder.
     * @param path
     * @constructor
     */
    public static Rimraf(path: string): Promise<void> {
        return new Promise((resolve, reject) => {
           rimraf(path, (err: Error) => {
             if (err)
                 return reject(err);
             
             resolve();
           });
        });
    }
}