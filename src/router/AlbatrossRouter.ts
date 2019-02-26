import * as express from "express";

export default class AlbatrossRouter {
    /**
     * Initializes the router for the server.
     * @param app
     * @constructor
     */
    public static Initialize(app: any): express.Router {
        const router: express.Router = express.Router();
        
        router.route("*").get((req: express.Request, res: express.Response) => {
           res.send(":D"); 
        });
        
        return router;
    }
}