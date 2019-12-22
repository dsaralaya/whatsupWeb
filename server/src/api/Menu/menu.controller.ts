import { Request, Response } from "express";
import Menu from "./menu.model";
const _ = require("lodash");

export default class MenuController {
  public async getall(req: Request, res: Response) {
    return Menu.find()
      .then(menus => {
        res.send({ status: "success", statusCode: "200", data: menus });
      })
      .catch(err => {
        res.send({
          message:
            err.message || "Some error occurred while retrieving menu list.",
          status: "failure",
          statusCode: "400"
        });
      });
  }

  public async getbyid(req: Request, res: Response) {
    Menu.findById(req.params.id)
      .then(menu => {
        if (!menu) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Menu not found with id " + req.body.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: menu });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error retrieving Menu with id " + req.body.id
        });
      });
  }

  public async create(req: Request, res: Response) {
    let menu = await Menu.findOne({ menuId: req.body.menuId });
    if (menu) {
      return res.send({
        message: "Menu already exists!",
        status: "failure",
        statusCode: "400"
      });
    } else {
      req.body['file'] = req.file.filename
      let menu = new Menu(req.body);
      //menu['file'] = req.file.filename;
      await menu.save();
      return res.send({
        status: "success",
        statusCode: "200",
        data: menu
      });
    }
  }

  public async update(req: Request, res: Response) {
    Menu.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(menu => {
        if (!menu) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Menu not found with ID: " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: menu });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error updating Menu with id " + req.body.id
        });
      });
  }

  public async delete(req: Request, res: Response) {
    Menu.findByIdAndRemove(req.params.id)
      .then(menu => {
        if (!menu) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Menu not found with id " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: menu });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error deleting Menu with id " + req.params.id
        });
      });
  }
}
