import { Schema , model} from "mongoose";

interface IUser {
    id?: string;
    name: string;
    email: string;
    password: string;
    isVerified?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        isVerified: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const UserModel = model<IUser>("User", userSchema);

export { IUser, UserModel };