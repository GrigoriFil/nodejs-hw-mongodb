import nodemailer from 'nodemailer';
import createHttpError from 'http-errors';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendMail = async (options) => {
  try {
    return await transporter.sendMail(options);
  } catch (error) {
    console.error(error);
    throw createHttpError(500, 'Failed to send the email, please try again later.');
  }
};