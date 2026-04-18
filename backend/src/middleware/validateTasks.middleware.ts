import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(1),
  projectId: z.string().min(1),
  status: z.enum(["pending", "in-progress", "completed"]).optional()
});

export const validateCreateTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    createTaskSchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((e: any) => e.message)
    });
  }
};

const updateTaskSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional()
});

export const validateUpdateTask = (req: Request, res: Response, next: NextFunction) => {
  try {
    updateTaskSchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((e: any) => e.message)
    });
  }
};

const statusSchema = z.object({
  status: z.enum(["pending", "in-progress", "completed"])
});

export const validateStatus = (req: Request, res: Response, next: NextFunction) => {
  try {
    statusSchema.parse(req.body);
    next();
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.errors?.map((e: any) => e.message)
    });
  }
};