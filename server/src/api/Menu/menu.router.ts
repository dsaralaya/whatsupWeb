import { Router } from "express";
import MenuController from "./menu.controller";
import validateAuth from "../../common/validateAuth";
import uploadImage from "../../common/multer";

export class MenuRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  init() {
    var controller = new MenuController();
    this.router.get("/list", validateAuth, controller.getall);
    this.router.get("/show/:id", validateAuth, controller.getbyid);
    this.router.post("/add", uploadImage, controller.create);
    this.router.put("/update/:id", validateAuth, uploadImage, controller.update);
    this.router.delete("/remove/:id", validateAuth, controller.delete);
  }
}

const Routes = new MenuRouter();
Routes.init();

export default Routes.router;
