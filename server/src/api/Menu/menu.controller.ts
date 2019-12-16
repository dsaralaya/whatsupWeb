import { Request, Response } from 'express';
import Menu from './menu.model';
const _ = require('lodash');


export default class MenuController {
    public async getall(req: Request, res: Response) {
        return Menu.find()
            .then(menus => {
                res.send(menus);
            }).catch(err => {
                res.send({
                    "message": err.message || "Some error occurred while retrieving menu list.", "status": "failure", "statusCode": "400"
                });
            });
    }

    public async getbyid(req: Request, res: Response) {
        Menu.findById(req.params.occupationId)
            .then(occupation => {
                if (!occupation) {
                    return res.send({
                        message: "Menu not found with id " + req.body.occupationId
                    });
                }
                res.send(occupation);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.send({
                        message: "Menu not found with id " + req.body.occupationId
                    });
                }
                return res.send({
                    message: "Error retrieving Menu with id " + req.body.occupationId
                });
            });
    }


    public async create(req: Request, res: Response) {
        let menu = new Menu(
            _.pick(req.body)
        );
        await menu.save();
        return res.send({
            status: "success",
            statusCode: "200",
            data: _.pick(menu)
        });
    }

    public async update(req: Request, res: Response) {
        Menu.findByIdAndUpdate(req.body.occupationId, {
            name: req.body.name,
        }, { new: true })
            .then(occupation => {
                if (!occupation) {
                    return res.send({
                        message: "Menu not found with ID: " + req.body.occupationId
                    });
                }
                res.send(occupation);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.send({
                        message: "Menu not found with id " + req.body.occupationId
                    });
                }
                return res.send({
                    message: "Error updating Menu with id " + req.body.occupationId
                });
            });

    }

    public async delete(req: Request, res: Response) {
        Menu.findByIdAndRemove(req.body.occupationId)
            .then(occupation => {
                if (!occupation) {
                    return res.send({
                        message: "Menu not found with id " + req.body.occupationId
                    });
                }
                res.send(occupation);
            }).catch(err => {
                if (err.kind === 'ObjectId') {
                    return res.send({
                        message: "Menu not found with id " + req.body.occupationId
                    });
                }
                return res.send({
                    message: "Error deleting Menu with id " + req.body.occupationId
                });
            });

    }

}