import { Router } from "express";
import ChatController from "./chat.controller";


export class ChatRouter {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        var controller = new ChatController();
        this.router.post("/receive", controller.receive);
        this.router.get("/getall", controller.getAllMessages);
        this.router.post("/send", controller.sendMessage);
    }
}

const Routes = new ChatRouter();
Routes.init();

export default Routes.router;