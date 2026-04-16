import { Router } from "express";

const router = Router();

// Importing routes
import authRoutes from "./auth.routes";

// Use routes
router.use("/auth/", authRoutes);

import projectRouter from "./project.routes";

router.use("/project/", projectRouter);

import taskRouter from "./task.routes";

router.use("/task/", taskRouter);

import statsRoutes from "./stats.routes";

router.use("/stats", statsRoutes)

export default router;