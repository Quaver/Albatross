import * as redis from "redis";
import {RedisClient} from "redis";
import Logger from "../logging/Logger";

export default class RedisHelper {
    /**
     * The main redis client.
     */
    public static Client: RedisClient;

    /**
     * Redis client to publish events.
     */
    public static Pub: RedisClient;
    
    /**
     * Initializes the redis client.
     * @constructor
     */
    public static async Initialize(config: object): Promise<void> {
        // Don't allow new redis clients to be initialized more than once. 
        if (RedisHelper.Client)
            throw Error("The main redis client already exists! There's no need to create another one.");
        
        RedisHelper.Client = redis.createClient(config);
        RedisHelper.Pub = redis.createClient(config);
        
        try {
            // Grab all existing login tokens on the server.
            const loginTokens: [] = await this.keys("quaver:server:token:*");
            
            // Delete all existing tokens.
            // TODO: If we're spinning up more than one API server at a time, we wont want to do this.
            if (loginTokens.length > 0) {
                loginTokens.forEach(async x => await this.del(x));
                Logger.Success(`Successfully cleared: ${loginTokens.length} login tokens`);
            }
            
        } catch (err) {
            Logger.Error(err);
            throw err;
        }
        
        Logger.Success("Successfully connected to Redis.");
    }

    /**
     * Promisifies the redis "keys" command.
     * @param pattern
     */
    public static async keys(pattern: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.keys(pattern, (err, rows) => {
                if (err)
                    return reject(err);
                
                return resolve(rows);
            });
        });
    }

    /**
     * Promisifies the redis "set" command.
     * @param key
     * @param value
     */
    public static async set(key: string, value: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.set(key, value, (err, ok) => {
                if (err)
                    return reject(err);
                
                return resolve(ok);
            });
        });
    }
    
    /**
     * Promisifies the redis setex command
     * @param key
     * @param value
     * @param expiry
     */
    public static async setex(key: string, value: string, expiry: number) : Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.setex(key, expiry, value, (err, ok) => {
                if (err)
                    return reject(err);
                
                return resolve(ok);
            })
        });
    }
    
    /**
     * Promisifies the redis "del" command
     * @param key
     */
    public static async del(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.del(key, (err, ok) => {
                if (err)
                    return reject(err);

                return resolve(ok);
            });
        });
    }

    /**
     * Promisifies the redis "get" command
     * @param key
     */
    public static async get(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.get(key, (err, val) => {
                if (err)
                    return reject(err);
                
                return resolve(val);
            });
        });
    }

    /**
     * Promisifies the redis "hgetall" command
     * @param key
     */
    public static async hgetall(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.hgetall(key, (err, val) => {
                if (err)
                    return reject(err);

                return resolve(val);
            });
        });
    }
    
    /**
     * Promisifies the redis "lrange" command.
     * @param key
     * @param start
     * @param stop
     */
    public static async lrange(key: string, start: number,  stop: number): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.lrange(key, start, stop, (err, list) => {
                if (err)
                    return reject(err);

                return resolve(list);
            });
        });
    }

    /**
     * Promisifies the redis "zrevrank" command.
     * @param key
     * @param id
     */
    public static async zrevrank(key: string, member: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.zrevrank(key, member, (err, rank) =>{
                if (err)
                    return reject(err);

                return resolve(rank);
            })
        });
    }

    /**
     * Promisifes the redis "zadd" command
     * @param set
     * @param score
     * @param str
     */
    public static zadd(set: string, score: number, str: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.zadd(set, score, str, (err, reply) => {
                if (err)
                    return reject(err);

                return resolve(reply);
            });
        });
    }

    /**
     * Promisifes the zrevrange command
     */
    public static zrevrange(key: string, start: number, end: number): Promise<any> {
        return new Promise((resolve, reject) => {
           this.Client.zrevrange(key, start, end, (err, reply) => {
               if (err)
                   return reject(err);
               
               return resolve(reply);
           }) ;
        });
    }

    /**
     * Promisifies the incr command.
     * @param key
     */
    public static incr(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.incr(key, (err, reply) => {
                if (err)
                    return reject(err);
                
                return resolve(reply);
            })
        })
    }
}