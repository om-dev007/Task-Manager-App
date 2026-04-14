import { model, Schema } from "mongoose";
import { otpEmailTemplate } from '../utils/otp.template.util';

interface IOTP {
    id?: string;
    email: string;
    otp: string;
    expiresAt: Date;
    createdAt?: Date;
    updatedAt?: Date;
}

const otpSchema = new Schema<IOTP>(
    {
        email: { type: String, required: true },
        otp: { type: String, required: true },
        expiresAt: { type: Date, required: true },
    },
    { timestamps: true }
);

const otpModel = model<IOTP>("OTP", otpSchema);

export { IOTP, otpModel };