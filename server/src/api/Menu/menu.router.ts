import { Router } from "express";
import MenuController from "./menu.controller";

export class MenuRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  init() {
    var controller = new MenuController();
    this.router.get("/list", controller.getall);
    this.router.get("/show/:id", controller.getbyid);
    this.router.post("/add", controller.create);
    this.router.put("/update/:id", controller.update);
    this.router.delete("/remove/:id", controller.delete);
  }
}

const Routes = new MenuRouter();
Routes.init();

export default Routes.router;
