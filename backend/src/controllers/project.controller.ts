import { Request, Response } from "express";
import { IResponse } from "../types/type";
import { projectModel } from "../models/project.model";

export const createProjectController = async (req: Request, res: Response) => {
    try {
        const {title, description} = req.body;
        const userId = (req as any).userId
        
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" } as IResponse);
        }

        const newProject = await projectModel.create({title, description, userId});

        return res.status(201).json({
            success: true,
            message: "Project created successfully",
            data: newProject
        } as IResponse); 
    }
    catch (error: any) {
        console.error("Error in createProjectController:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Failed to create project" } as IResponse);
    }
}

export const getAllProjectsController = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).userId;

        const projects = await projectModel.find({ userId });

        if(projects.length === 0) {
            return res.status(404).json({ success: false, message: "No projects found for this user" } as IResponse);
        }

        return res.status(200).json({
            success: true,
            message: "Projects retrieved successfully",
            data: projects
        } as IResponse);
    }
    catch(error: any) {
        console.error("Error in getProjectController:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Failed to get project" } as IResponse);
    }
}

export const getOneProjectController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const userId = (req as any).userId;

        const project = await projectModel.findOne({ _id: id, userId });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" } as IResponse);
        }

        return res.status(200).json({
            success: true,
            message: "Project retrieved successfully",
            data: project
        } as IResponse);
    }
    catch(error: any) {
        console.error("Error in getOneProjectController:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Failed to get project" } as IResponse);
    }
}

export const updateProjectController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const {title, description} = req.body;

        if(!title && !description) {
            return res.status(400).json({ success: false, message: "At least one field (title or description) is required to update" } as IResponse);
        }

        const userId = (req as any).userId;

        const project = await projectModel.findOne({ _id: id, userId });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" } as IResponse);
        }

        project.title = title || project.title;
        project.description = description || project.description;

        await project.save();

        return res.status(200).json({
            success: true,
            message: "Project updated successfully",
            data: project
        } as IResponse);
    }
    catch(error: any) {
        console.error("Error in updateProjectController:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Failed to update project" } as IResponse);
    }
}

export const deleteProjectController = async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const userId = (req as any).userId;

        const project = await projectModel.findOneAndDelete({ _id: id, userId });

        if (!project) {
            return res.status(404).json({ success: false, message: "Project not found" } as IResponse);
        }

        return res.status(200).json({
            success: true,
            message: "Project deleted successfully"
        } as IResponse);
    }
    catch(error: any) {
        console.error("Error in deleteProjectController:", error.message);
        return res.status(500).json({ success: false, message: error.message || "Failed to delete project" } as IResponse);
    }
}