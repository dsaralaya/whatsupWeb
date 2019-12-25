import { Request, Response } from "express";
import ImageHistory from "./imageHistory.model";
import { appConfig } from "../../config/appConfig";
const _ = require("lodash");
const url = appConfig.get('siteURL');
export default class ImageHistoryController {
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
  public async getIdList(req: Request, res: Response) {
    var img = await ImageHistory.find({ messageId: { $in: JSON.parse(req.params.id) } });
    for (var i = 0; i < img.length; i++) {
      img[i]['image'] = url + '/' + img[i]['image'];
    }
    return res.send(img);
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

  public async create(req) {
    let imageHistory = await ImageHistory.findOne({ messageId: req.message_id });
    if (!imageHistory) {
      let imageHistory = new ImageHistory({ messageId: req.message_id, image: req.path });
      await imageHistory.save();
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
