import express from "express";
import * as bodyParser from "body-parser";
import cors from 'cors';
import Routes from "./router";

class Express {
  public app: express.Express;
  constructor() {
    this.app = express();
    this.setMiddleware();
    this.setRoutes();
    this.setDb();
  }

  private setMiddleware() {
    this.app.use(bodyParser.json());
    this.app.use(cors())
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }

  private setRoutes() {
    new Routes(this.app);
  }
  private setDb() {
    // mongoose
    //   .connect(appConfig.get('db').url, { useNewUrlParser: true, useUnifiedTopology:true })
    //   .then(() => console.log("Now connected to MongoDB!"))
    //   .catch(err => console.error("Something went wrong", err));

    // mongoose.set("useCreateIndex", true);
    // mongoose.set("useFindAndModify", false);
  }

  
}

export default new Express().app;
