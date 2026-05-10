const passwordResetTemplate = (resetLink) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #0a0a0f; color: #fff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #60a5fa; margin: 0;">Traveloop</h1>
    <p style="color: #9ca3af; font-size: 14px;">Your AI Travel Companion</p>
  </div>
  
  <h2 style="color: #fff; margin-bottom: 20px;">Password Reset Request</h2>
  <p style="color: #d1d5db; line-height: 1.6;">You are receiving this email because you (or someone else) has requested the reset of a password for your account.</p>
  <p style="color: #d1d5db; line-height: 1.6;">Please click on the button below to complete the process. This link is valid for 15 minutes.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${resetLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
  </div>
  
  <p style="color: #9ca3af; font-size: 14px; line-height: 1.5;">If you did not request this, please ignore this email and your password will remain unchanged.</p>
  <hr style="border: 0; border-top: 1px solid #374151; margin: 30px 0;">
  <p style="color: #6b7280; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Traveloop. All rights reserved.</p>
</div>
`;

const emailVerificationTemplate = (verifyLink) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px; background-color: #0a0a0f; color: #fff;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #60a5fa; margin: 0;">Traveloop</h1>
    <p style="color: #9ca3af; font-size: 14px;">Your AI Travel Companion</p>
  </div>
  
  <h2 style="color: #fff; margin-bottom: 20px;">Verify Your Email Address</h2>
  <p style="color: #d1d5db; line-height: 1.6;">Welcome to Traveloop! We're excited to help you plan your next adventure.</p>
  <p style="color: #d1d5db; line-height: 1.6;">Please click on the button below to verify your email address and activate your account. This link is valid for 24 hours.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${verifyLink}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email</a>
  </div>
  
  <p style="color: #9ca3af; font-size: 14px; line-height: 1.5;">If you did not create an account, no further action is required.</p>
  <hr style="border: 0; border-top: 1px solid #374151; margin: 30px 0;">
  <p style="color: #6b7280; font-size: 12px; text-align: center;">&copy; ${new Date().getFullYear()} Traveloop. All rights reserved.</p>
</div>
`;

module.exports = {
  passwordResetTemplate,
  emailVerificationTemplate
};
