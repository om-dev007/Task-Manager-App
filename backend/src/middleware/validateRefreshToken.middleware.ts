import { Request, Response, NextFunction } from "express";
import z from "zod";

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export const validateRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const data = {
      refreshToken: req.cookies?.refreshToken, // 👈 yaha change
    };

    refreshTokenSchema.parse(data);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((err: any) => err.message),
    });
  }
};
