import { Router } from "express";
import DeviceController from "./device.controller";

export class DeviceRouter {
    public router: Router;

    constructor() {
        this.router = Router();
    }

    init() {
        var controller = new DeviceController();
        this.router.get("/status", controller.status);
    }
}

const Routes = new DeviceRouter();
Routes.init();

export default Routes.router;