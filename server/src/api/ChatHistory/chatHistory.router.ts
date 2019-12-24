import { Router } from "express";
import ChatHistoryController from "./chatHistory.controller";
import validateAuth from "../../common/validateAuth";

export class ChatHistoryRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  init() {
    var controller = new ChatHistoryController();
    this.router.get("/list", validateAuth, controller.getall);
    this.router.get("/show/:id", validateAuth, controller.getbyid);
    this.router.post("/add", validateAuth, controller.create);
    this.router.put("/update/:id", validateAuth, controller.update);
    this.router.delete("/remove/:id", validateAuth, controller.delete);
    this.router.put("/endchat/:id", validateAuth, controller.endchat);
  }
}

const Routes = new ChatHistoryRouter();
Routes.init();

export default Routes.router;
