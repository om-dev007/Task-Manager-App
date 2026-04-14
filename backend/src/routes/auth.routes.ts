import { Router } from "express";
import { generateNewTokenController, logInController, logOutController, logOutFromAllDevicesController, registerController, resendOtpController, verifyOtpController } from "../controllers/auth.controllers";

const authRoutes = Router();

// Register route
authRoutes.post("/register", registerController)

authRoutes.get("/test", (req, res) => {
    res.send("Server is running properly")
})
// Login route
authRoutes.post("/login", logInController)

// Access token route

authRoutes.post("/access-token", generateNewTokenController)

// Verify OTP route
authRoutes.post("/verify-otp", verifyOtpController)

//  Resend OTP route

authRoutes.post("/resend-otp", resendOtpController)

// Logout route

authRoutes.post("/logout", logOutController);

//  LogOut from all devices route

authRoutes.post("/logout-all", logOutFromAllDevicesController);

export default authRoutes;