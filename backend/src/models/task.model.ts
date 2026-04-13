import { model, Schema } from "mongoose";

interface ITask {
    id?: string;
    title: string;
    description: string;
    status: "pending" | "in-progress" | "completed";
    projectId: any;
    userId: any;
    completed: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const taskSchema = new Schema<ITask>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "in-progress", "completed"],
            default: "pending",
        },
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project", required: true, trim: true
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", required: true, trim: true
        },
        completed: {
            type: Boolean, default: false 
        },
    },
    { timestamps: true }
);

const taskModel = model<ITask>("Task", taskSchema);

export { ITask, taskModel };