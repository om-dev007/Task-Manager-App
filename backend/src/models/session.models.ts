import { model, Schema } from "mongoose";

interface ISession {
    id?: string;
    userId: any;
    token?: string;
    isRevoked?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const sessionSchema = new Schema<ISession>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User", required: true, trim: true
        },
        token: { type: String },
        isRevoked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const sessionModel = model<ISession>("Session", sessionSchema);

export { ISession, sessionModel };