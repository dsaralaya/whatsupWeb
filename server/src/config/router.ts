
import { Router, Request, Response } from "express";

// import  AnswersRouter from "../api/answers/answers.router";


export default class Routes {
    public router: Router;
    private app;

    constructor(app) {

        // Set router
        this.router = Router();

        // Set app
        this.app = app;

        // Set all routes
        this.setAllRoutes();

        this.setMainRoute();
    }
    private setAllRoutes() {
      
        //this.app.use('/api/answers', AnswersRouter);
      
    }

    private setMainRoute() {
        // All other routes should redirect to the index.html
        this.app.route('/*').get(this.index);
    }

    private index(req: Request, res: Response) {
        res.json({
            message: 'Hello Connecting!'
        });
    }
}