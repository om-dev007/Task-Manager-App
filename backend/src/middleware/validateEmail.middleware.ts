import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const emailOnlySchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const validateEmailOnly = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    emailOnlySchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((err: any) => err.message),
    });
  }
};