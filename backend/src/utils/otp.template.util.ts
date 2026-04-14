export const otpEmailTemplate = (otp: string) => {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
    
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center">
          
          <table width="500px" style="background: #ffffff; padding: 20px; border-radius: 10px;">
            
            <tr>
              <td align="center">
                <h2 style="color: #333;">Verify Your Email</h2>
              </td>
            </tr>

            <tr>
              <td>
                <p style="color: #555; font-size: 16px;">
                  Hello, <br/><br/>
                  Your OTP for verification is:
                </p>
              </td>
            </tr>

            <tr>
              <td align="center">
                <div style="
                  font-size: 28px;
                  font-weight: bold;
                  background: #f0f0f0;
                  padding: 10px 20px;
                  display: inline-block;
                  border-radius: 5px;
                  letter-spacing: 5px;
                ">
                  ${otp}
                </div>
              </td>
            </tr>

            <tr>
              <td>
                <p style="color: #777; font-size: 14px;">
                  This OTP is valid for 5 minutes. Do not share it with anyone.
                </p>
              </td>
            </tr>

            <tr>
              <td align="center">
                <p style="font-size: 12px; color: #aaa;">
                  © 2026 Your App. All rights reserved.
                </p>
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </div>
  `;
};