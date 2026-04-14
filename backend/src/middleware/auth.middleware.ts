import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { IResponse } from "../types/type";

export const authMiddleware = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: "Authorization header missing" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ success: false, message: "Token missing" });
    }

    try {
        const decoded: any = jwt.verify(token, config.jwtSecret || "secret");

        req.userId = decoded.userId;
        next();
    } catch (error: any) {
        if (error.name === "TokenExpiredError") {
        return res.status(401).json({
            success: false,
            message: "Access token expired"
        } as IResponse);
    }

    return res.status(401).json({
        success: false,
        message: "Invalid token"
    } as IResponse);
    }
}