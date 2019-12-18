import { Router, Request, Response } from "express";

import RegisterRouter from "../api/register/register.router";
import LoginRouter  from "../api/Login/login.router";
import MenuRouter from "../api/Menu/menu.router";
import ChatHistoryRouter from "../api/ChatHistory/chatHistory.router";
import ImageHistoryRouter from "../api/ImageHistory/imageHistory.router";

export default class Routes {
  public router: Router;
  private app;

  constructor(app) {
    // Set router
    this.router = Router();

    // Set app
    this.app = app;

    // Set all routes
    this.setAllRoutes();

    this.setMainRoute();
  }
  private setAllRoutes() {
    this.app.use("/api/register", RegisterRouter);
    this.app.use("/api/login", LoginRouter);
    this.app.use("/api/menu", MenuRouter);
    this.app.use("/api/chathistory", ChatHistoryRouter);
    this.app.use("/api/imagehistory", ImageHistoryRouter);
  }

  private setMainRoute() {
    this.app.route("/*").get(this.index);
  }

  private index(req: Request, res: Response) {
    res.json({
      message: "Hello Connecting!"
    });
  }
}
