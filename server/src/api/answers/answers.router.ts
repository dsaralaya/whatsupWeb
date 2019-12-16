import { Router } from "express";
import AnswersController from "./answers.controller";



export class AnswersRouter {
    public router: Router

    constructor() {
        this.router = Router();
    }

    init() {
        var controller = new AnswersController();
        this.router.get('/list', controller.getall);
        this.router.get('/show/:id', controller.getbyid);
        this.router.post('/add', controller.create);
        this.router.put('/update/:id', controller.update);
        this.router.delete('/remove/:id', controller.delete);
       
    }
}

const Routes = new AnswersRouter();
Routes.init();

export default Routes.router;