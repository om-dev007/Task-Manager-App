import { Request, Response, NextFunction } from "express";
import z from "zod";

const verifyOtpSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z
    .string()
    .min(4, "OTP must be at least 4 digits")
    .max(6, "OTP must be at most 6 digits"),
});

export const validateVerifyOtp = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    verifyOtpSchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((err: any) => err.message),
    });
  }
};