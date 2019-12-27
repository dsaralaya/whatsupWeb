import { Router } from "express";
import SettingsController from "./settings.contoller";
import validateAuth from "../../common/validateAuth";
export class SettingsRouter {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        var controller = new SettingsController();
        this.router.post("/update", controller.update);
        this.router.get("/get", controller.get);
    }
}

const Routes = new SettingsRouter();
Routes.init();

export default Routes.router;
