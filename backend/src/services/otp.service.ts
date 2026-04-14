import { otpModel } from "../models/otp.model";
import { comparePassword } from "../utils/hash.util";
import { IResponse } from "../types/type";
import { UserModel } from "../models/user.model";

export const verifyOtpService = async (email: string, otp: string) => {
    try {
        // Find the OTP record for the given email
        const otpRecord = await otpModel.findOne({ email });

        if (!otpRecord) {
            return { success: false, message: "OTP not found for this email" } as IResponse;
        }

        // Check if the OTP has expired
        if (otpRecord.expiresAt < new Date()) {
            return { success: false, message: "OTP has expired" } as IResponse;
        }
        
        // Compare the provided OTP with the hashed OTP in the database
        const isOtpValid = await comparePassword(otp, otpRecord.otp);
        
        if (!isOtpValid) {
            return { success: false, message: "Invalid OTP" } as IResponse;
        }

        // If OTP is valid, you can proceed with the next steps (e.g., activating the user account)

        const deleteResult = await otpModel.deleteOne({ email });
        console.log("OTP record deleted:", deleteResult); // Debugging log  
        const user = await UserModel.findOne({ email });
        if (user) {
            user.isVerified = true;
            await user.save();
        }

        return { success: true, message: "OTP verified successfully" } as IResponse;

    }
    catch (error: any) {
        console.error("Error in verifyOtpService:", error.message);
        return { success: false, message: "OTP verification failed" } as IResponse
    }
}
