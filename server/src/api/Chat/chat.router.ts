import { Router } from "express";
import ChatController from "./chat.controller";
import uploadImage from '../../common/multer';

export class ChatRouter {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        var controller = new ChatController();
        this.router.post("/receive", controller.receive.bind(controller));
        this.router.get("/getall/:id", controller.getAllMessages);
        this.router.post("/load_more", controller.loadMore);
        this.router.post("/send", uploadImage.array('file',5), controller.sendMessage);
    }
}

const Routes = new ChatRouter();
Routes.init();

export default Routes.router;