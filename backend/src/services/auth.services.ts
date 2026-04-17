import { UserModel } from "../models/user.model";
import { IResponse } from "../types/type";
import { comparePassword, hashPassword } from "../utils/hash.util";

export const registerService = async (name: string, email: string, password: string) => {

    try {

        const existingUser: any = await UserModel.findOne({ email });

        if (existingUser) {
            return { success: false, message: "User already exists" } as IResponse;
        }

        if(existingUser.isVerified) {
            return {
                success: false,
                message: "User already exists and is verified. Please log in."
            } as IResponse;
        }

        name.trim();
        email.trim().toLowerCase();
        password.trim().toLowerCase();

        const hashPass = await hashPassword(password);

        const newUser = await UserModel.create({ name, email, password: hashPass });

        return { success: true, message: "User registered successfully", data: newUser } as IResponse
    } catch (error: any) {  
        console.error("Error in registerService:", error.message);
        return { success: false, message: "Registration failed" } as IResponse
    }
}


export const logInService = async (email: string, password: string) => {
    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return { success: false, message: "User not found with this email" } as IResponse;
        }

        // Compare passwords
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
            return { success: false, message: "Invalid credentials" } as IResponse;
        }

        const isUserVerified = await UserModel.findOne({ email, isVerified: true });
        
        if (!isUserVerified) {
            return { success: false, message: "Please verify your email before logging in" } as IResponse;
        }

        return { success: true, message: "Login successful", data: user } as IResponse;
    }
    catch (error: any) {
        console.error("Error in logInService:", error.message);
        return { success: false, message: "Login failed" } as IResponse
    }
}