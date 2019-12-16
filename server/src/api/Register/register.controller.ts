import { Request, Response } from 'express';
import User from './register.model';
const _ = require('lodash');


export default class RegisterController {
    public async getall(req: Request, res: Response) {
     return User.find()
        .then(users => {
            res.status(200).json(users);
        }).catch(err => {
            res.status(500).send({
                "message": err.message || "Some error occurred while retrieving users list.","status":"failure","statusCode":"400"
            });
        });
    }

    public async getbyid(req: Request, res: Response) {
        return res.status(200).json({ updated: true });
    }


    public async create(req: Request, res: Response) {
      try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
          return res.send({
              message: "User already exists!",
              status: "failure",
              statusCode: "404"
            });
        } else {
          user = new User(
            _.pick(req.body, [
              "email",
              "password",
              "userRole",
              "assignedChatCount"
            ])
          );
          // const salt = await bcrypt.genSalt(10);
          //user.password = await bcrypt.hash(user.password, salt);
          await user.save();
        return res.send({
            status: "success",
            statusCode: "200",
            data: _.pick(user, [
              "_id",
              "email",
              "password",
              "userRole",
              "assignedChatCount"
            ])
          });
        }
      } catch(err) {
        console.log(err);
      }
    }

    public async update(req: Request, res: Response) {
        return res.status(200).json({ updated: true });

    }

    public async delete(req: Request, res: Response) {
        return res.status(200).json({ updated: true });

    }

}