import { Router, Request, Response, NextFunction } from "express";
import { TaskService } from "./task.service";

const taskRouter = Router();
const taskService = new TaskService();

taskRouter
  .get("/:id", async (req: Request, res: Response, next: NextFunction) => {
    try {
      let task = await taskService.getTask(req.params.id);
      res.status(200).send(task);
    } catch (error) {
      res.status(400).send(error);
    }
    next();
  })
  .post("/:user_id", async (req: Request, res: Response) => {
    try {
      await taskService.createTask(req.body, req.params.user_id);
      res.status(201).send();
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .put("/:user_id", async (req: Request, res: Response) => {
    try {
      let response = await taskService.updateTask(
        req.params.user_id,
        req.body
      );
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  })
  .delete("/user_id/:id", async (req: Request, res: Response) => {
    try {
      let response = await taskService.deleteTask(
        req.params.user_id,
        req.params.id
      );
      res.status(200).send(response);
    } catch (error) {
      res.status(400).send(error);
    }
  });

export default taskRouter;
