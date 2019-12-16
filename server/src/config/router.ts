import { Router, Request, Response } from "express";

import registerRouter from "../api/register/register.router";

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
    this.app.use("/api/register", registerRouter);
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
