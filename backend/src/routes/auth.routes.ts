import { Router } from "express";
import { logInController, registerController } from "../controllers/auth.controllers";

const authRoutes = Router();

// Register route
authRoutes.post("/register", registerController)

authRoutes.get("/test", (req, res) => {
    res.send("Server is running properly")
})
// Login route
authRoutes.post("/login", logInController)

export default authRoutes;