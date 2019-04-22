import * as azurestorage from "azure-storage";
import BlobService = azurestorage.services.blob.blobservice.BlobService;
import Logger from "../logging/Logger";
import * as fs from "fs";
import streams = azurestorage.common.streams;
import { Stream } from "stream";
const azure = require("azure-storage");

export default class Azure {
    /**
     *  The actual blob service
     */
    public static Service: BlobService;
    
    /**
     * Initializes the blob service for azure for later use.
     * @constructor
     */
    public static Initialize(connString: string): void {
        if (Azure.Service)
            throw new Error("You can only have one BlobService at a time.");
        
        Azure.Service = azure.createBlobService(connString);
        Logger.Success("Successfully created Azure Blob Service");
    }

    /**
     * Uploads a local file to azure.
     * @param container
     * @param name
     * @param path
     * @constructor
     */
    public static async CreateBlobFromLocalFile(container: string,  name: string, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            Azure.Service.createBlockBlobFromLocalFile(container, name, path, (err, result, response) => {
                if (err)
                    return reject(err);
                
                return resolve({ result, response });
            });
        });
    }
    
    /**
     * Deletes a blog from azure if it exists.
     * @param container
     * @param blob
     * @constructor
     */
    public static async DeleteBlobIfExists(container: string, blob: string): Promise<any> {
        return new Promise((resolve, reject) => {
           Azure.Service.deleteBlobIfExists(container, blob, (err, result) => {
               if (err)
                   return reject(err);
               
               return resolve(result);
           }); 
        });
    }

    /**
     * Downloads a blob to disk.
     * @param container
     * @param blob
     * @param path
     * @constructor
     */
    public static async DownloadBlob(container: string, blob: string, path: string): Promise<any> {
        return new Promise((resolve, reject) => {
            let stream = fs.createWriteStream(path);
            
           Azure.Service.getBlobToStream(container, blob, stream, (error, result, response) => {
               if (error) {
                   stream.close();
                   return reject(error);
               }
               
               return resolve({ result, response });
           });
        });
    }
}