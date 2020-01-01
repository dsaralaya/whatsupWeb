import { Request, Response } from "express";
import chatHistory from "./chatHistory.model";
import User from "../../common/model/user.model";
const _ = require("lodash");

export default class ChatHistoryController {
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
    chatHistory.find({ assignedTo: req.params.id })
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

  public async create(sender) {
    let chathistory = await chatHistory.findOne({ senderId: sender });
    if (chathistory) {
      return chathistory;
    } else {
      let chathistory = new chatHistory({ senderId: sender, menuId: 1 });
      await chathistory.save();
      return null;
    }
  }
  public async endchat(req: Request, res: Response) {
    var history = await chatHistory.findOne({ senderId: req.params.id });
    await chatHistory.findByIdAndRemove(history._id);
    var user = await User.findOne({ _id: history['assignedTo'] })
    await User.findOneAndUpdate({ _id: user._id }, { $set: { assignedChatCount: user['assignedChatCount'] - 1 } });

    res.send({ status: "success", statusCode: "200" });
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

  public async deleteMultipleRecords(req: Request) {
    chatHistory.find(req)
      .then(chathistory => {
        if (!chathistory) {
         
        } else {
          chatHistory.deleteMany(req).then(deletedChatHistory => {

          })
          .catch(err => {
            
          })
        }
      })
      .catch(err => {
        
      });
  }
}
