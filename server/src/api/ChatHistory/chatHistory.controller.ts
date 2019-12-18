import { Request, Response } from "express";
import chatHistory from "./chatHistory.model";
const _ = require("lodash");

export default class MenuController {
  public async getall(req: Request, res: Response) {
    return chatHistory.find()
      .then(chathistories => {
        res.send({ status: "success", statusCode: "200", data: chathistories });
      })
      .catch(err => {
        res.send({
          message:
            err.message || "Some error occurred while retrieving chathistory list.",
          status: "failure",
          statusCode: "400"
        });
      });
  }

  public async getbyid(req: Request, res: Response) {
    chatHistory.findById(req.params.id)
      .then(chathistory => {
        if (!chathistory) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "chatHistory not found with id " + req.body.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: chathistory });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error retrieving chatHistory with id " + req.body.id
        });
      });
  }

  public async create(req: Request, res: Response) {
    let chathistory = await chatHistory.findOne({ menuId: req.body.menuId });
    if (chathistory) {
      return res.send({
        message: "chatHistory already exists!",
        status: "failure",
        statusCode: "400"
      });
    } else {
      let chathistory = new chatHistory(req.body);
      await chathistory.save();
      return res.send({
        status: "success",
        statusCode: "200",
        data: chathistory
      });
    }
  }

  public async update(req: Request, res: Response) {
    chatHistory.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(chathistory => {
        if (!chathistory) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "chatHistory not found with ID: " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: chathistory });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error updating chatHistory with id " + req.body.id
        });
      });
  }

  public async delete(req: Request, res: Response) {
    chatHistory.findByIdAndRemove(req.params.id)
      .then(chathistory => {
        if (!chathistory) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "chatHistory not found with id " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: chathistory });
      })
      .catch(err => {
        return res.send({
          status: "failure",
          statusCode: "400",
          message: "Error deleting chatHistory with id " + req.params.id
        });
      });
  }
}
