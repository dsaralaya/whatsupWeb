import { Request, Response } from "express";
var fs = require('fs');
var dir = require('path').join(__dirname, '../../cred.json');

export default class SettingsController {

    public async update(req: Request, res: Response) {
        fs.writeFile(dir, JSON.stringify(req.body), (err) => {
            return res.send({ status: "success", statusCode: "200", data: req.body });
        });

    }

    public async get(req: Request, res: Response) {

        await fs.readFile(dir, { encoding: 'utf-8' }, (err, data) => {

            return res.send({ status: "success", statusCode: "200", data: JSON.parse(data) });
        });

    }
}