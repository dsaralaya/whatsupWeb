import { Router, Request, Response } from "express";

import RegisterRouter from "../api/Register/register.router";
import LoginRouter  from "../api/Login/login.router";
import MenuRouter from "../api/Menu/menu.router";
import ChatHistoryRouter from "../api/ChatHistory/chatHistory.router";
import ImageHistoryRouter from "../api/ImageHistory/imageHistory.router";
import ChatRouter  from "../api/Chat/chat.router";
import ContactRouter  from "../api/contacts/contacts.router";
import UploadImagesRouter from "../api/UploadImages/uploadImages.router";
import SettingsRouter  from "../api/Settings/settings.router";
import DeviceRouter from "../api/Device/device.router";

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
    this.app.use("/api/chat", ChatRouter);
    this.app.use("/api/contact", ContactRouter);
    this.app.use("/api/images", UploadImagesRouter);
    this.app.use("/api/settings", SettingsRouter);
    this.app.use("/api/device", DeviceRouter);
    
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
