import express from "express";
import * as bodyParser from "body-parser";

import Routes from "./router";


class Express {
    public app: express.Express;
    constructor() {
        this.app = express();
        this.setMiddleware();
        this.setRoutes();
        this.setDb();
    }

    private setMiddleware() {
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: false }));
    }

    private setRoutes() {
        // Create Routes, and export its configured Express.Router
        new Routes(this.app);
    }
    private setDb() {
        
    }

}

export default new Express().app;