import * as brevo from '@getbrevo/brevo';
import dotenv from "dotenv";
dotenv.config();

const transporter = new brevo.TransactionalEmailsApi();
transporter.setApiKey(
  brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY
);

export default transporter;
