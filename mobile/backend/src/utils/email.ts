/* src/utils/email.ts */

import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

const sendGridApiKey = process.env.SENDGRID_API_KEY;
const sendGridFromEmail = process.env.SENDGRID_SENDER_EMAIL;

if (!sendGridApiKey || !sendGridFromEmail) {
    console.error("❌ Error: SENDGRID_API_KEY o SENDGRID_FROM_EMAIL no están configurados en .env");
    process.exit(1); // Detener la ejecución si falta la configuración
}

sgMail.setApiKey(sendGridApiKey);

export const sendEmail = async (to: string, subject: string, html: string) => {
    const msg = {
        to,
        from: sendGridFromEmail,
        subject,
        html,
    };

    try {
        await sgMail.send(msg);
        console.log(`📧 Email enviado con éxito a ${to}`);
        return true;
    } catch (error: any) {
        console.error('❌ Error enviando el email:', error.response?.body || error.message);
        return false;
    }
};
