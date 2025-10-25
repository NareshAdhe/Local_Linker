import * as brevo from '@getbrevo/brevo';
import dotenv from "dotenv";
dotenv.config();

const apiClient = new brevo.TransactionalEmailsApi();
apiClient.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Wrapper to maintain nodemailer-like interface
const transporter = {
  async sendMail(mailOptions) {
    const sendSmtpEmail = new brevo.SendSmtpEmail();
    
    sendSmtpEmail.subject = mailOptions.subject;
    sendSmtpEmail.htmlContent = mailOptions.html;
    sendSmtpEmail.sender = { 
      name: "LocalLinker", 
      email: process.env.SENDER_MAIL 
    };
    sendSmtpEmail.to = [{ email: mailOptions.to }];
    
    const response = await apiClient.sendTransacEmail(sendSmtpEmail);
    console.log('✅ Email sent via Brevo API');
    return response;
  }
};

export default transporter;
