import { Router, Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { authenticateToken, signUp } from "./user.middleware";

const userRouter = Router();
const userService = new UserService();

userRouter
  .get(
    "/",
    authenticateToken,
    async (_req: Request, res: Response, next: NextFunction) => {
      try {
        let response = await userService.getUser(res.locals.id);
        response.error
          ? res.status(400).send(response)
          : res.status(200).send(response);
        next();
      } catch (error) {
        res.status(400).send(error);
      }
    }
  )
  .post("/", signUp, async (req: Request, res: Response) => {
    try {
      let response = await userService.createUser(req.body);
      res.status(201).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .put("/", authenticateToken, async (req: Request, res: Response) => {
    try {
      let response = await userService.updateUser(res.locals.id, req.body);
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete("/", authenticateToken, async (req: Request, res: Response) => {
    try {
      let response = await userService.deleteUser(res.locals.id);
      response.error
        ? res.status(400).send(response)
        : res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
    console.log(req.params);
    res.status(200).json({ message: "User deleted" });
  })
  .post("/login", async (req: Request, res: Response) => {
    try {
      let response = await userService.login(req.body);
      response.error
        ? res.status(400).send(response)
        : res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  });

export default userRouter;
