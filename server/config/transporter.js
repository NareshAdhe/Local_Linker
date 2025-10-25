import * as brevo from '@getbrevo/brevo';
import dotenv from "dotenv";
dotenv.config();

// Initialize Brevo API client
const apiInstance = new brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

// Wrapper to match nodemailer interface
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
    
    try {
      const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
      console.log('✅ Email sent via Brevo API:', response.messageId);
      return response;
    } catch (error) {
      console.error('❌ Brevo API error:', error);
      throw error;
    }
  },
  
  async verify() {
    if (!process.env.BREVO_API_KEY) {
      throw new Error('BREVO_API_KEY not configured');
    }
    console.log('✅ Brevo API configured');
    return true;
  }
};

export default transporter;
