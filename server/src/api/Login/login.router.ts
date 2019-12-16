import { Router } from "express";
import LoginController from "./login.controller";

export class LoginRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  init() {
    var controller = new LoginController();
    this.router.post("/add", controller.create);
  }
}

const Routes = new LoginRouter();
Routes.init();

export default Routes.router;
