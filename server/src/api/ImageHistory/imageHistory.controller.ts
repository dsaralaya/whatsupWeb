import { Request, Response } from "express";
import ImageHistory from "./imageHistory.model";
const _ = require("lodash");

export default class MenuController {
  public async getall(req: Request, res: Response) {
    return ImageHistory.find()
      .then(imageHistories => {
        res.send({ status: "success", statusCode: "200", data: imageHistories });
      })
      .catch(err => {
        res.send({
          message:
            err.message || "Some error occurred while retrieving imageHistory list.",
          status: "failure",
          statusCode: "400"
        });
      });
  }

  public async getbyid(req: Request, res: Response) {
    ImageHistory.findById(req.params.id)
      .then(imageHistory => {
        if (!imageHistory) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "ImageHistory not found with id " + req.body.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: imageHistory });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error retrieving ImageHistory with id " + req.body.id
        });
      });
  }

  public async create(req: Request, res: Response) {
    let imageHistory = await ImageHistory.findOne({ menuId: req.body.menuId });
    if (imageHistory) {
      return res.send({
        message: "ImageHistory already exists!",
        status: "failure",
        statusCode: "400"
      });
    } else {
      let imageHistory = new ImageHistory(req.body);
      await imageHistory.save();
      return res.send({
        status: "success",
        statusCode: "200",
        data: imageHistory
      });
    }
  }

  public async update(req: Request, res: Response) {
    ImageHistory.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(imageHistory => {
        if (!imageHistory) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "ImageHistory not found with ID: " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: imageHistory });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error updating ImageHistory with id " + req.body.id
        });
      });
  }

  public async delete(req: Request, res: Response) {
    ImageHistory.findByIdAndRemove(req.params.id)
      .then(imageHistory => {
        if (!imageHistory) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "ImageHistory not found with id " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: imageHistory });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error deleting ImageHistory with id " + req.params.id
        });
      });
  }
}
