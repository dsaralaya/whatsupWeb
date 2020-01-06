import { Router } from "express";
import ContactsController from "./contacts.controller";
import validateAuth from "../../common/validateAuth";

export class ContactsRouter {
  public router: Router;

  constructor() {
    this.router = Router();
  }

  init() {
    var controller = new ContactsController();
    this.router.get("/list", validateAuth, controller.getall);
    this.router.get("/show/:id", validateAuth, controller.getbyid);
    this.router.post("/add", validateAuth, controller.create);
    this.router.put("/update/:id", validateAuth, controller.update);
    this.router.delete("/remove/:id", validateAuth, controller.delete);
  }
}

const Routes = new ContactsRouter();
Routes.init();

export default Routes.router;
