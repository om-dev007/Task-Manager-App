import {Router} from "express";
import { createTaskController, deleteTaskController, filterTasksByLatestCreatedTaskController, filterTasksByLatestUpdatedTaskController, filterTasksBySuccessStatusController, getAllTasksController, getOneTaskController, toggleTaskSuccessController, updateTaskController } from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateCreateTask, validateUpdateTask, validateStatus } from "../middleware/validateTasks.middleware";

const taskRouter = Router();

// Create task route

taskRouter.post("/create", authMiddleware, validateCreateTask, createTaskController);

// Get all task route

taskRouter.get("/get", authMiddleware, getAllTasksController);

// Get one task route

taskRouter.get("/get-one/:id", authMiddleware, getOneTaskController)

// Update task route 

taskRouter.patch("/update/:id", authMiddleware, validateUpdateTask ,updateTaskController)

// Delete task route

taskRouter.delete("/delete/:id", authMiddleware, deleteTaskController)

// Update task status route

taskRouter.patch("/update-status/:id", authMiddleware, validateStatus ,toggleTaskSuccessController)

// Find tasks by success status

taskRouter.get("/get-tasks-success/", authMiddleware, filterTasksBySuccessStatusController)

// Find tasks by latest created task

taskRouter.get("/latest-created-tasks/", authMiddleware, filterTasksByLatestCreatedTaskController)

// Find tasks by latest updated task

taskRouter.get("/latest-updated-tasks/", authMiddleware, filterTasksByLatestUpdatedTaskController)


export default taskRouter;