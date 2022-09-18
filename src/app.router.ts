import { Request, Response, Router } from "express";

const appRouter = Router();

appRouter.get("/", (_req: Request, res: Response) => {
    res.status(200).send()
})

export default appRouter