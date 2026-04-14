import { Request, Response } from "express"
import { IResponse } from "../types/type"
import { taskModel } from "../models/task.model"

export const createTaskController = async (req: Request, res: Response) => {
    try {
        const { title, description, projectId } = req.body;
        const userId = (req as any).userId;

        if (!title || !description || !projectId) {
            return res.status(400).json({ success: false, message: "Title, description and projectId are required" } as IResponse);
        }

        const newTask = await taskModel.create({ title, description, projectId, userId });

        return res.status(201).json({
            success: true,
            message: "Task created successfully",
            data: newTask
        } as IResponse);
    }
    catch (error: any) {
        console.error("Error in createTaskController:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Failed to create task" } as IResponse);
    }
}

export const getAllTasksController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;
        const { projectId } = req.query;

        if (!projectId) {
            return res.status(400).json({ success: false, message: "ProjectId is required" } as IResponse);
        }

        const tasks = await taskModel.find({ userId, projectId });

        if (tasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found for this project" } as IResponse);
        }

        return res.status(200).json({
            success: true,
            message: "Tasks retrieved successfully",
            data: tasks
        } as IResponse);
    }
    catch (error: any) {
        console.error("Error in getAllTasksController:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Failed to get tasks" } as IResponse);
    }
}

export const getOneTaskController = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const userId = (req as any).userId;

        const task = await taskModel.findOne({ _id: id, userId });

        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" } as IResponse);
        }

        return res.status(200).json({
            success: true,
            message: "Task retrieved successfully",
            data: task
        } as IResponse);
    }
    catch (error: any) {
        console.error("Error in getOneTaskController:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Failed to get task" } as IResponse);
    }
}