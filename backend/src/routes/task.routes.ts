import {Router} from "express";
import { createTaskController, deleteTaskController, filterTasksBySuccessStatusController, getAllTasksController, getOneTaskController, toggleTaskSuccessController, updateTaskController } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const taskRouter = Router();

// Create task route

taskRouter.post("/create", authMiddleware, createTaskController);

// Get all task route

taskRouter.get("/get", authMiddleware, getAllTasksController);

// Get one task route

taskRouter.get("/get-one/:id", authMiddleware, getOneTaskController)

// Update task route 

taskRouter.patch("/update/:id", authMiddleware, updateTaskController)

// Delete task route

taskRouter.delete("/delete/:id", authMiddleware, deleteTaskController)

// Update task status route

taskRouter.patch("/update-status/:id", authMiddleware, toggleTaskSuccessController)

// Find tasks by success status

taskRouter.get("/get-tasks-success/", authMiddleware, filterTasksBySuccessStatusController)


export default taskRouter;