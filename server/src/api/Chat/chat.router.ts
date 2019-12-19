import { Router } from "express";
import ChatController from "./chat.controller";
import multer from "multer";
import path from "path";
var fs = require('fs');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        var dir = require('path').join(__dirname, '../../uploads/');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
let upload = multer({ storage: storage }).single('file'); 
export class ChatRouter {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        var controller = new ChatController();
        this.router.post("/receive", controller.receive);
        this.router.get("/getall", controller.getAllMessages);
        this.router.post("/send", upload,controller.sendMessage);
    }
}

const Routes = new ChatRouter();
Routes.init();

export default Routes.router;