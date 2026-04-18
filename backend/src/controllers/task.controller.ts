import { Request, Response } from "express";
import { IResponse } from "../types/type";
import { taskModel } from "../models/task.model";
import mongoose from "mongoose";

export const createTaskController = async (req: Request, res: Response) => {
  try {
    const { title, description, projectId } = req.body;
    const userId = (req as any).userId;

    const newTask = await taskModel.create({
      title,
      description,
      projectId,
      userId,
    });

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: newTask,
    } as IResponse);
  } catch (error: any) {
    console.error("Error in createTaskController:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to create task",
    } as IResponse);
  }
};

export const getAllTasksController = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).userId;
    const { projectId } = req.query;

    if (!projectId) {
      return res.status(400).json({
        success: false,
        message: "ProjectId is required",
      } as IResponse);
    }

    const tasks = await taskModel.find({ userId, projectId });

    if (tasks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tasks found for this project",
      } as IResponse);
    }

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: tasks,
    } as IResponse);
  } catch (error: any) {
    console.error("Error in getAllTasksController:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get tasks",
    } as IResponse);
  }
};

export const getOneTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const task = await taskModel.findOne({ _id: id, userId });

    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" } as IResponse);
    }

    return res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    } as IResponse);
  } catch (error: any) {
    console.error("Error in getOneTaskController:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get task",
    } as IResponse);
  }
};

export const updateTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const userId = (req as any).userId;

    const updatedTask = await taskModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: { title, description } },
      { new: true },
    );

    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not authorized to update",
      } as IResponse);
    }

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    } as IResponse);
  } catch (error: any) {
    console.error("Error in updateTaskController:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to update task",
    } as IResponse);
  }
};

export const deleteTaskController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;

    const deletedTask = await taskModel.findOneAndDelete({ _id: id, userId });

    if (!deletedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not authorized to delete",
      } as IResponse);
    }

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
      data: deletedTask,
    } as IResponse);
  } catch (error: any) {
    console.error("Error in deleteTaskController:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete task",
    } as IResponse);
  }
};

export const toggleTaskSuccessController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { id } = req.params;

    const userId = (req as any).userId;

    const { status } = req.body;

    const task = (await taskModel.findOne({ _id: id, userId })) as any;

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found with this id",
      } as IResponse);
    }

    task.status = status;
    await task?.save();

    return res.status(200).json({
      success: true,
      message: "Task toggled successfully",
      data: task,
    } as IResponse);
  } catch (error: any) {
    console.log(error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    } as IResponse);
  }
};

export const filterTasksBySuccessStatusController = async (
  req: Request,
  res: Response,
) => {
  try {
    let { status, projectId } = req.query;
    const userId = (req as any).userId;

    if (!projectId) {
      const allTasks = await taskModel.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId as any) },
        },
        {
          $project: {
            _id: 0,
            userId: 0,
            projectId: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "All tasks is found successfully",
        data: allTasks,
      });
    }

    const matchStage: any = {
      userId: new mongoose.Types.ObjectId(userId),
      projectId: new mongoose.Types.ObjectId(projectId as string),
    };

    if (status) {
      matchStage.status = (status as string).toLowerCase();
    }

    const tasks = await taskModel.aggregate([
      {
        $match: matchStage,
      },
      {
        $project: {
          _id: 0,
          userId: 0,
          projectId: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
        },
      },
    ]);

    console.log("Tasks:", tasks);

    if (!tasks.length) {
      return res.status(404).json({
        success: false,
        message: "No tasks found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Tasks found successfully",
      data: tasks,
    });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};

export const filterTasksByLatestCreatedTaskController = async (
  req: Request,
  res: Response,
) => {
  try {
    const { projectId } = req.query;

    const userId = (req as any).userId;

    if (!projectId) {
      const tasks = await taskModel.aggregate([
        {
          $match: { userId: new mongoose.Types.ObjectId(userId) },
        },
        {
          $sort: { createdAt: -1 },
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "Task found by globally",
        data: tasks,
      } as IResponse);
    }

    const tasks = await taskModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          projectId: new mongoose.Types.ObjectId(projectId as any),
        },
      },
      {
        $sort: { createdAt: -1 },
      },
    ]);

    return res.status(200).json({
      success: true,
      message: "Tasks found by lastest created",
      data: tasks,
    } as IResponse);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    } as IResponse);
  }
};
