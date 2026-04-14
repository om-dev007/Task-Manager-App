import { Router } from "express";

const projectRouter = Router();

import { createProjectController, deleteProjectController, getAllProjectsController, updateProjectController, getOneProjectController } from "../controllers/project.controller";
import { authMiddleware } from "../middleware/auth.middleware";

// Create project route

projectRouter.post("/create", authMiddleware, createProjectController);

// Get all project route

projectRouter.get("/get", authMiddleware, getAllProjectsController);

// Get one project route

projectRouter.get("/get/:id", authMiddleware, getOneProjectController);

// Update project route

projectRouter.patch("/update/:id", authMiddleware, updateProjectController);

// Delete project route

projectRouter.delete("/delete/:id", authMiddleware, deleteProjectController);

export default projectRouter;