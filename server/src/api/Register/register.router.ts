import { Router } from "express";
import RegisterController from "./register.controller";

export class RegisterRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  init() {
    var controller = new RegisterController();
    this.router.get("/list", controller.getall);
    this.router.get("/show/:id", controller.getbyid);
    this.router.post("/add", controller.create);
    this.router.put("/update/:id", controller.update);
    this.router.delete("/remove/:id", controller.delete);
  }
}

const Routes = new RegisterRouter();
Routes.init();

export default Routes.router;
