import { Router, Request, Response, NextFunction } from "express";
import { authenticateToken } from "../User/user.middleware";
import { TaskService } from "./task.service";

const taskRouter = Router();
const taskService = new TaskService();

taskRouter
  .get(
    "/:id",
    authenticateToken,
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        let response = await taskService.getTask(req.params.id);
        res.status(200).send(response);
      } catch (error) {
        res.status(400).send(error);
      }
      next();
    }
  )
  .post("/", authenticateToken, async (req: Request, res: Response) => {
    try {
      let response = await taskService.createTask(req.body, res.locals.id);
      res.status(201).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .put("/", authenticateToken, async (req: Request, res: Response) => {
    try {
      let response = await taskService.updateTask(res.locals.id, req.body);
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete("/:id", authenticateToken, async (req: Request, res: Response) => {
    try {
      let response = await taskService.deleteTask(res.locals.id, req.params.id);
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  });

export default taskRouter;
