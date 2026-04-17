import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import { checkStatsByPerProjectController, checkStatsForAllProject } from "../controllers/stats.controller";

const statsRoutes = Router();

statsRoutes.get("/project/:id", authMiddleware, checkStatsByPerProjectController)
statsRoutes.get("/all-project", authMiddleware, checkStatsForAllProject)

export default statsRoutes;