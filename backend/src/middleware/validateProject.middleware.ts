import { Request, Response, NextFunction } from "express";
import { z } from "zod";

// 🧠 schema
const createProjectSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .trim(),

  description: z
    .string()
    .min(1, "Description is required")
    .trim(),
});

// 🔥 middleware
export const validateCreateProject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    createProjectSchema.parse(req.body);

    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((err: any) => err.message),
    });
  }
};

const updateProjectSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional(),
});

export const validateUpdateProject = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    updateProjectSchema.parse(req.body);

    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((err: any) => err.message),
    });
  }
};