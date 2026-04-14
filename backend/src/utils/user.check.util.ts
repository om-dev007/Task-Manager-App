import { UserModel } from "../models/user.model";

export const checkUserVerification = async (email: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { success: false, message: "User not found with this email" };
        }
        return { success: true, message: "User found" };
    } catch (error: any) {
        console.error("Error in checkUserVerification:", error.message);
        return { success: false, message: "Failed to check user verification" };
    }
}