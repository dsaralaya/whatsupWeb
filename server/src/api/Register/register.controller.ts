import { Request, Response } from "express";
import User from "../../common/model/user.model";
const bcrypt = require("bcrypt");
const _ = require("lodash");

export default class RegisterController {
  public async getall(req: Request, res: Response) {
    return User.find()
      .then(users => {
        res.send({ status: "success", statusCode: "200", data: users });
      })
      .catch(err => {
        res.send({
          message:
            err.message || "Some error occurred while retrieving users list.",
          status: "failure",
          statusCode: "400"
        });
      });
  }

  public async getbyid(req: Request, res: Response) {
    User.findById(req.params.id)
      .then(user => {
        if (!user) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Menu not found with id " + req.body.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: user });
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
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.send({
          message: "User already exists!",
          status: "failure",
          statusCode: "400"
        });
      } else {
        user = new User(
          _.pick(req.body, [
            "name",
            "email",
            "password",
            "userRole",
            "assignedChatCount",
            "status"
          ])
        );
        const salt = await bcrypt.genSalt(10);
        user["password"] = await bcrypt.hash(user["password"], salt);
        await user.save();
        return res.send({
          status: "success",
          statusCode: "200",
          data: _.pick(user, [
            "_id",
            "name",
            "email",
            "userRole",
            "assignedChatCount",
            "status"
          ])
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async update(req: Request, res: Response) {
    User.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(user => {
        if (!user) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Menu not found with ID: " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: user });
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
    User.findByIdAndRemove(req.params.id)
      .then(user => {
        if (!user) {
          return res.send({
            status: "failure",
            statusCode: "400",
            message: "Menu not found with id " + req.params.id
          });
        }
        res.send({ status: "success", statusCode: "200", data: user });
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
