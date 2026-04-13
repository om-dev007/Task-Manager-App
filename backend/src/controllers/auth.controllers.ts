import { Request, Response } from "express";
import { logInService, registerService } from "../services/auth.services";
import { IResponse } from "../types/type";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { hashPassword } from "../utils/hash.util";
import { sessionModel } from "../models/session.models";

export const registerController = async (req: Request, res: Response) => {
    try {
        const {name, email, password} = req.body;

        const user = await registerService(name, email, password)

        if (!user.success) {
            return res.status(400).json({
                success: false,
                message: user.message
            } as IResponse);
        }

        return res.status(201).json({
            success: true,
            message: user.message,
            data: user.data
        } as IResponse);

    }
    catch (error: any) {
        console.error("Error in registerController:", error.message);
        return res.status(500).json({ success: false, message: "Registration failed" } as IResponse);
    }
}

export const logInController = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body;

        const user = await logInService(email, password);

        if(!user.success) {
            return res.status(400).json({
                success: false,
                message: user.message
            } as IResponse);
        }

        const session = await sessionModel.create({userId: user.data._id, token: ""})

        const refreshToken = jwt.sign({userId: user.data._id}, config.jwtSecret, {expiresIn: "7d"})

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        const hashedRefreshToken = await hashPassword(refreshToken);

        session.token = hashedRefreshToken;
        await session.save();

        const accessToken = jwt.sign({userId: user.data._id, email: user.data.email}, config.jwtSecret, {expiresIn: "15m"})

        return res.status(200).json({
            success: true,
            message: "User logged in successfully",
            data: {
                accessToken,
                user: {
                    email: user.data.email,
                    name: user.data.name,
                    id: user.data._id
                }
            }
        } as IResponse)
    }
    catch (error: any) {
        console.error("Error in logInController:", error.message);
        return res.status(500).json({ success: false, message: error.message ||"Login failed" } as IResponse);
    }
}