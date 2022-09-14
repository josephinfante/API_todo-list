import express, { Application } from "express";
import "dotenv/config";
import taskRouter from "./Task/task.route";
import userRouter from "./User/user.route";

export class App {
  app: Application;

  constructor() {
    this.app = express();
    this.settings();
    this.middlewares();
    this.routes();
  }

  settings() {
    this.app.set("port", process.env.PORT || 3000);
  }

  middlewares() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use("/task", taskRouter);
    this.app.use("/user", userRouter);
  }

  listen(): void {
    this.app.listen(this.app.get("port"), () => {
      console.log("Server on port ", this.app.get("port"));
    });
  }
}
