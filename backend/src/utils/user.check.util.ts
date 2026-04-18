import { UserModel } from "../models/user.model";
import { IResponse } from "../types/type";

export const checkUserVerification = async (email: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { success: false, message: "User not found with this email" } as IResponse;
        }

        if(user.isVerified) {
            return {
                success: false,
                message: "User verified already please go to the login page"
            } as IResponse;
        }
        return { success: true, message: "User found" }as IResponse ;
    } catch (error: any) {
        console.error("Error in checkUserVerification:", error.message);
        return { success: false, message: "Failed to check user verification" } as IResponse ;
    }
}