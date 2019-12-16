import { Request, Response } from 'express';
import User from './login.model';
var passwordHash = require('password-hash');
const _ = require('lodash');
import { appConfig } from "../../config/appConfig";
const jwt = require('jsonwebtoken');

export default class LoginController {

    public async create(req: Request, res: Response) {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.send({ message: 'Incorrect email or password.' });
        }
        const validPassword = passwordHash.compare(user['password'], req.body.password);
        if (!validPassword) {
            return res.send({ message: 'Incorrect email or password.' });
        }
        const token = jwt.sign({ _id: user._id }, appConfig.get('PrivateKey'));
        res.header('x-auth-token', token);
        res.send({ id: user._id, name: user['name'], email: user['email'], role: user['userRole'], access_token: token });
    }
}