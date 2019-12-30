import { Router } from "express";
import UploadImagesController from "./uploadImages.controller";
import uploadImage from "../../common/multer";

export class UploadImagesRouter {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        var controller = new UploadImagesController();
        this.router.post("/upload", uploadImage.array('file',5), controller.upload);
        this.router.get("/delete", controller.delete);
        //this.router.post("/send", upload,controller.sendMessage);
    }
}

const Routes = new UploadImagesRouter();
Routes.init();

export default Routes.router;