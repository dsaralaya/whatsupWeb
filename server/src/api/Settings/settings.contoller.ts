import { Request, Response } from "express";
import * as fs from 'fs-extra';
var dir = require('path').join(__dirname, '../cred.json');

export default class SettingsController {

    public async update(req: Request, res: Response) {
        fs.writeFile(dir, req.body, (err) => {
            return ({ status: "success", statusCode: "200", data: req.body });
        });
       
    }


    public async get(req: Request, res: Response) {
     
        await fs.readFile(dir, { encoding: 'utf-8' },(err,data) => {
            console.log(err);
            console.log(data);
            return ({ status: "success", statusCode: "200", data: data });
        });
       
    }
}