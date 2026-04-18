import { Request, Response } from "express";
import { logInService, registerService } from "../services/auth.services";
import { IResponse } from "../types/type";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { comparePassword, hashPassword } from "../utils/hash.util";
import { sessionModel } from "../models/session.model";
import { otp } from "../utils/otp.util";
import { otpModel } from "../models/otp.model";
import { verifyOtpService } from "../services/otp.service";
import { UserModel } from "../models/user.model";
import { sendOtpEmail } from "../services/email.service";
import { checkUserVerification } from "../utils/user.check.util";

export const registerController = async (req: Request, res: Response) => {
  try {
    let { name, email, password } = req.body;

    name = name.trim();
    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await registerService(name, email, password);

    if (!user.success) {
      return res.status(400).json({
        success: false,
        message: user.message,
      } as IResponse);
    }

    const generatedOtp = otp();

    await sendOtpEmail(email, generatedOtp);

    const hashOtp = await hashPassword(generatedOtp);

    const otpDb = await otpModel.create({
      email,
      otp: hashOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(201).json({
      success: true,
      message: user.message,
      data: {
        user: {
          email: user.data.email,
          name: user.data.name,
          id: user.data._id,
          otpId: otpDb._id,
        },
      },
    } as IResponse);
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "Registration failed",
    } as IResponse);
  }
};

export const logInController = async (req: Request, res: Response) => {
  try {
    let { email, password } = req.body;

    email = email.trim().toLowerCase();
    password = password.trim();

    const user = await logInService(email, password);

    if (!user.success) {
      return res.status(400).json({
        success: false,
        message: user.message,
      } as IResponse);
    }

    const session = await sessionModel.create({
      userId: user.data._id,
      token: "",
    });

    const refreshToken = jwt.sign(
      { userId: user.data._id, sessionId: session._id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const hashedRefreshToken = await hashPassword(refreshToken);

    session.token = hashedRefreshToken;
    await session.save();

    const accessToken = jwt.sign(
      { userId: user.data._id, email: user.data.email },
      config.jwtSecret,
      { expiresIn: "15m" }
    );

    return res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        user: {
          email: user.data.email,
          name: user.data.name,
          id: user.data._id,
        },
      },
    } as IResponse);
  } catch {
    return res.status(500).json({
      success: false,
      message: "Login failed",
    } as IResponse);
  }
};

export const verifyOtpController = async (req: Request, res: Response) => {
  try {
    const { email, otp } = req.body;

    const result = await verifyOtpService(email, otp);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: result.message,
      } as IResponse);
    }

    return res.status(200).json({
      success: true,
      message: result.message,
    } as IResponse);
  } catch (error: any) {
    console.error("Error in verifyOtpController:", error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: "OTP verification failed",
      } as IResponse);
  }
};

export const resendOtpController = async (req: Request, res: Response) => {
  try {
    let { email } = req.body;

    email = email.trim().toLowerCase();

    const userVerification = await checkUserVerification(email);

    if (!userVerification.success) {
      return res.status(400).json({
        success: false,
        message: userVerification.message,
      } as IResponse);
    }

    const existingOtp = await otpModel.findOne({ email });

    if (existingOtp) {
      return res.status(400).json({
        success: false,
        message: "OTP already sent. Please wait.",
      } as IResponse);
    }

    const generatedOtp = otp();

    await sendOtpEmail(email, generatedOtp);

    const hashOtp = await hashPassword(generatedOtp);

    const otpDb = await otpModel.create({
      email,
      otp: hashOtp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    return res.status(200).json({
      success: true,
      message: "OTP resent successfully",
      data: {
        email,
        otpId: otpDb._id,
      },
    } as IResponse);
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
    } as IResponse);
  }
};

export const generateNewTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({
        success: false,
        message: "Refresh token not found",
      } as IResponse);
    }

    let decoded: any;

    try {
      decoded = jwt.verify(refreshToken, config.jwtSecret);
    } catch {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired refresh token",
      } as IResponse);
    }

    const session = await sessionModel.findById(decoded.sessionId);

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Session not found",
      } as IResponse);
    }

    const isValid = await comparePassword(refreshToken, session.token as any);

    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid refresh token",
      } as IResponse);
    }

    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      } as IResponse);
    }

    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      config.jwtSecret,
      { expiresIn: "15m" }
    );

    const newRefreshToken = jwt.sign(
      { userId: user._id, sessionId: session._id },
      config.jwtSecret,
      { expiresIn: "7d" }
    );

    const hashedRefreshToken = await hashPassword(newRefreshToken);

    session.token = hashedRefreshToken;
    await session.save();

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({
      success: true,
      message: "New access token generated successfully",
      data: { accessToken },
    } as IResponse);
  } catch {
    return res.status(500).json({
      success: false,
      message: "Failed to generate new access token",
    } as IResponse);
  }
};

export const logOutController = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Refresh token not found",
        } as IResponse);
    }

    const decoded = jwt.verify(refreshToken, config.jwtSecret);

    const session = await sessionModel.findOne({
      _id: (decoded as any).sessionId,
    });

    if (!session) {
      return res
        .status(400)
        .json({ success: false, message: "Session not found" } as IResponse);
    }

    await sessionModel.deleteOne({ _id: session._id });

    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" } as IResponse);
  } catch (error: any) {
    console.error("Error in logOutController:", error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Logout failed",
      } as IResponse);
  }
};

export const logOutFromAllDevicesController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Refresh token not found",
        } as IResponse);
    }

    const decoded = jwt.verify(refreshToken, config.jwtSecret);

    await sessionModel.deleteMany({ userId: (decoded as any).userId });

    res.clearCookie("refreshToken");

    return res
      .status(200)
      .json({
        success: true,
        message: "Logged out from all devices successfully",
      } as IResponse);
  } catch (error: any) {
    console.error("Error in logOutFromAllDevicesController:", error.message);
    return res
      .status(500)
      .json({
        success: false,
        message: error.message || "Logout from all devices failed",
      } as IResponse);
  }
};
