import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { signUp } from './user.middleware'

const userRouter = Router();
const userService = new UserService();

userRouter
  .get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      let user = await userService.getUser(req.params.id);
      user.error ? res.status(400).send(user) : res.status(200).send(user);
      next();
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .post("/", signUp, async (req: Request, res: Response) => {
    try {
      let user = await userService.createUser(req.body);
      res.status(201).send(user);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .put("/:id", (req: Request, res: Response) => {
    console.log(req.params, req.body);
    res.status(200).json({ message: "Updating a user" });
  })
  .delete("/:id", (req: Request, res: Response) => {
    console.log(req.params);
    res.status(200).json({ message: "User deleted" });
  });

export default userRouter;
