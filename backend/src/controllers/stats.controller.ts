import { Request, Response } from "express";
import { IResponse } from "../types/type";
import { projectModel } from "../models/project.model";
import { taskModel } from "../models/task.model";
import mongoose from "mongoose";

export const checkStatsByPerProjectController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const userId = (req as any).userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not found please login",
      } as IResponse);
    }

    if (!id) {
      return res.status(404).json({
        success: false,
        message: "Please choose valid project",
      } as IResponse);
    }

    const project = await projectModel.findOne({ _id: id, userId });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Project not found",
      } as IResponse);
    }

    const totalTasks = await taskModel.find({
      userId,
      projectId: id,
    });

    const stats = await taskModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          projectId: new mongoose.Types.ObjectId(id as any),
        },
      },
      {
        $group: {
          _id: null,
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
        },
      },
      {
        $project: {
          _id: 0,
        },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Project Stats",
      data: {
        totalTasks: totalTasks.length,
        stats,
      },
    } as IResponse);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    } as IResponse);
  }
};

export const checkStatsForAllProject = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;

    const Totaltasks = await taskModel.find({ userId });

    const tasks = await taskModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $group: {
          _id: null,
          pending: {
            $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] },
          },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
          },
          inProgress: {
            $sum: { $cond: [{ $eq: ["$status", "in-progress"] }, 1, 0] },
          },
        },
      },
      {
        $project: {_id: 0}
      }
    ]);

    return res.status(200).json({
      success: true,
      message: "Tasks found",
      totalTasks: Totaltasks.length,
      tasks,
    } as IResponse);

  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    } as IResponse);
  }
};
