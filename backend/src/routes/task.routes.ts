import {Router} from "express";
import { createTaskController, getAllTasksController, getOneTaskController } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const taskRouter = Router();

// Create task route

taskRouter.post("/create", authMiddleware, createTaskController);

// Get all task route

taskRouter.get("/get", authMiddleware, getAllTasksController);

// Get one task route

taskRouter.get("/get-one/:id", authMiddleware, getOneTaskController)

export default taskRouter;