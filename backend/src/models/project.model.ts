import { Schema, model } from "mongoose";

interface IProject {
    id?: string;
    title: string;
    description: string;
    userId: any;
    createdAt?: Date;
    updatedAt?: Date;
}

const projectSchema = new Schema<IProject>(
    {
        title: { type: String, required: true, trim: true },
        description: { type: String, required: true },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", required: true, trim: true
        },
    },
    { timestamps: true }
);

const projectModel = model<IProject>("Project", projectSchema);

export {IProject, projectModel}