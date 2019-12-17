import { appConfig } from "../config/appConfig";
const jwt = require("jsonwebtoken");

export default function(req, res, next) {
  var token =
    req.body.token || req.query.token || req.headers["x-access-token"];
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, appConfig.get("PrivateKey"), function(err, decoded) {
      if (err) {
        //failed verification.
        return res.send({ error: "Invalid token" });
      }
      //req.body.userId = decoded._id;
      req.decoded = decoded;
      next(); //no error, proceed
    });
  } else {
    // forbidden without token
    return res.send({
      error: "No token found"
    });
  }
}
