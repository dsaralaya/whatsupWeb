import { appConfig } from "../config/appConfig";
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
    jwt.verify(req.headers['x-access-token'], appConfig.get('PrivateKey'), function(err, decoded) {
      if (err) {
        res.json({status:"error", message: err.message, data:null});
      }else{
        // add user id to request
        req.body.userId = decoded._id;
        next();
      }
    });
}