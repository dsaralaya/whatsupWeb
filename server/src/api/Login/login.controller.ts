import { Request, Response } from "express";
import User from "../../common/model/user.model";
const bcrypt = require("bcrypt");
const _ = require("lodash");
import { appConfig } from "../../config/appConfig";
const jwt = require("jsonwebtoken");

export default class LoginController {

  public async create(req: Request, res: Response) {
    let user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({status: "failure", statusCode: "400", message: "Incorrect email or password." });
    }
    const validPassword = await bcrypt.compare(
      req.body.password,
      user["password"]
    );
    if (!validPassword) {
      return res.send({status: "failure", statusCode: "400", message: "Incorrect email or password." });
    }
    const token = jwt.sign({ _id: user._id }, appConfig.get("PrivateKey"));
    res.header("x-auth-token", token);
    res.send({
      status: "success", statusCode: "200", data: {
      id: user._id,
      name: user["name"],
      email: user["email"],
      role: user["userRole"],
      access_token: token
      }
    });
  }
}
