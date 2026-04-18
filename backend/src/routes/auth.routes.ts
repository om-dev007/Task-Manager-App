import { Router } from "express";
import { generateNewTokenController, logInController, logOutController, logOutFromAllDevicesController, registerController, resendOtpController, verifyOtpController } from "../controllers/auth.controllers";
import { validateRegister, validateLogin } from "../middleware/validateAuth.middleware";
import { authMiddleware } from "../middleware/auth.middleware";
import { validateEmailOnly } from "../middleware/validateEmail.middleware";
import { validateVerifyOtp } from "../middleware/validateOtp.middleware";
import { validateRefreshToken } from "../middleware/validateRefreshToken.middleware";

const authRoutes = Router();

// Register route
authRoutes.post("/register", validateRegister ,registerController)

authRoutes.get("/test", (req, res) => {
    res.send("Server is running properly")
})
// Login route
authRoutes.post("/login", validateLogin ,logInController)

// Access token route

authRoutes.post("/access-token", validateRefreshToken ,generateNewTokenController)

// Verify OTP route
authRoutes.post("/verify-otp", validateVerifyOtp ,verifyOtpController)

//  Resend OTP route

authRoutes.post("/resend-otp", validateEmailOnly ,resendOtpController)

// Logout route

authRoutes.post("/logout", authMiddleware ,logOutController);

//  LogOut from all devices route

authRoutes.post("/logout-all", authMiddleware ,logOutFromAllDevicesController);

export default authRoutes;