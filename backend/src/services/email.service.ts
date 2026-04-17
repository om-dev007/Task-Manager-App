import { config } from "../config/config";
import { transporter } from "../utils/email.util";
import { otpEmailTemplate } from "../utils/otp.template.util";

export const sendOtpEmail = async (email: string, otp: string) => {
  await transporter.sendMail({
    from: `"Your App" <${config.userEmail}>`,
    to: email,
    subject: "Your OTP Code",
    html: otpEmailTemplate(otp) 
  });
};
