import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").trim(),

  email: z.string().email("Invalid email format"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    registerSchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((err: any) => err.message),
    });
  }
};

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    loginSchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((err: any) => err.message),
    });
  }
};

