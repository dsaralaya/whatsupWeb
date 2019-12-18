import { Router } from "express";
import ImageHistoryController from "./imageHistory.controller";
import validateAuth from "../../common/validateAuth";

export class ImageHistoryRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  init() {
    var controller = new ImageHistoryController();
    this.router.get("/list", validateAuth, controller.getall);
    this.router.get("/show/:id", validateAuth, controller.getbyid);
    this.router.post("/add", validateAuth, controller.create);
    this.router.put("/update/:id", validateAuth, controller.update);
    this.router.delete("/remove/:id", validateAuth,controller.delete);
  }
}

const Routes = new ImageHistoryRouter();
Routes.init();

export default Routes.router;
