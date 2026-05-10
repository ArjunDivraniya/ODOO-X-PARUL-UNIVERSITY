const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  async sendCollaboratorInvite(email, inviterName, tripTitle, permission) {
    const mailOptions = {
      from: `"Traveloop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `You've been invited to collaborate on ${tripTitle}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #3b82f6;">Traveloop Collaboration</h2>
          <p>Hi there,</p>
          <p><strong>${inviterName}</strong> has invited you to join the trip <strong>"${tripTitle}"</strong> as a <strong>${permission}</strong>.</p>
          <p>Start planning your amazing adventure together!</p>
          <div style="margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">View Trip</a>
          </div>
          <p style="font-size: 12px; color: #666;">If you didn't expect this invitation, you can safely ignore this email.</p>
        </div>
      `
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error('Email Invite Error:', error);
    }
  }
}

module.exports = new EmailService();
