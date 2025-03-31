import sgMail from '@sendgrid/mail';
import dotenv from 'dotenv';

dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

class EmailService {
  static async sendEmail(subject: string, text: string, html: string): Promise<void> {
    const msg = {
      to: 'test@example.com',
      from: 'veratrinidadesteban@gmail.com.com', // Cambia esto a tu remitente verificado
      subject,
      text,
      html,
    };

    try {
      await sgMail.send(msg);
      console.log('Email sent');
    } catch (error) {
      console.error(error);
    }
  }
}

export default EmailService;
