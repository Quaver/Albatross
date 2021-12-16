import * as redis from "redis";
import {RedisClient} from "redis";
import Logger from "../logging/Logger";
import ChatManager from "../chat/ChatManager";
import Bot from "../bot/Bot";
import SongRequestHandler from "../twitch/SongRequestHandler";
import Albatross from "../Albatross";
import { values } from "lodash";

export default class RedisHelper {
    /**
     * The main redis client.
     */
    public static Client: RedisClient;

    /**
     * Redis client to  subscribe to events
     */
    public static Sub: RedisClient;
    
    private static FirstPlaceScoresChannel: string = "quaver:first_place_scores";

    private static SongRequestsChannel: string = "quaver:song_requests";

    private static TwitchConnectionChannel: string = "quaver:twitch_connection";

    private static MultiplayerMapSharesChannel: string = "quaver:multiplayer_map_shares";

    /**
     * Initializes the redis client.
     * @constructor
     */
    public static async Initialize(config: object): Promise<void> {
        // Don't allow new redis clients to be initialized more than once. 
        if (RedisHelper.Client)
            throw Error("The main redis client already exists! There's no need to create another one.");
        
        RedisHelper.Client = redis.createClient(config);
        RedisHelper.Sub = redis.createClient(config);

        this.Sub.on("subscribe", (chan, count) => Logger.Success(`Successfully subscribed to Redis Channel: ${chan} - Count: ${count}`));

        this.Sub.on("message", async (chan, message) => {
            switch (chan) {
                // First Place Ranks
                case RedisHelper.FirstPlaceScoresChannel:
                    const firstPlaceScore = JSON.parse(message);

                    await ChatManager.SendMessage(Bot.User, "#announcements", `${firstPlaceScore.user.username} has just achieved first place ` 
                        + `on: "${firstPlaceScore.map.artist} - ${firstPlaceScore.map.title} [${firstPlaceScore.map.difficulty_name}]."`);
                    break;
                // Twitch Song Requests
                case RedisHelper.SongRequestsChannel:
                    await SongRequestHandler.HandleTwitchSongRequest(JSON.parse(message));
                    break;
                // User has connected their twitch account
                case RedisHelper.TwitchConnectionChannel:
                    await SongRequestHandler.HandleTwitchConnection(JSON.parse(message));
                    break;
                // Multiplayer host temporarily shared a map for users
                case RedisHelper.MultiplayerMapSharesChannel:
                    const shareInfo = JSON.parse(message);
                    const multiplayerUser = Albatross.Instance.OnlineUsers.GetUserById(shareInfo.uploader_id);

                    if (multiplayerUser.CurrentGame && multiplayerUser.CurrentGame.GameId == shareInfo.game_id)
                        await multiplayerUser.CurrentGame.UpdateSharedMapStatus();
                        
                    break;
            }
        });


        this.Sub.subscribe(RedisHelper.FirstPlaceScoresChannel);
        this.Sub.subscribe(RedisHelper.SongRequestsChannel);
        this.Sub.subscribe(RedisHelper.TwitchConnectionChannel);
        this.Sub.subscribe(RedisHelper.MultiplayerMapSharesChannel);
        
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
     * Promisifies the redis hset command
     * @param key 
     * @param field 
     * @param value 
     */
    public static async hset(key: string, field: string, value: string): Promise<any> {
        if (!value) return;

        return new Promise((resolve, reject) => {
            this.Client.hset(key, field, value, (err, val) => {
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

        /**
     * Promisifies the decr command.
     * @param key
     */
    public static decr(key: string): Promise<any> {
        return new Promise((resolve, reject) => {
            this.Client.decr(key, (err, reply) => {
                if (err)
                    return reject(err);
                
                return resolve(reply);
            })
        })
    }
}