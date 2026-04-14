import { Router } from "express";

const router = Router();

// Importing routes
import authRoutes from "./auth.routes";

// Use routes
router.use("/auth/", authRoutes);

import projectRouter from "./project.routes";

router.use("/project/", projectRouter);


export default router;