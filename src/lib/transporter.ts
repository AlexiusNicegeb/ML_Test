import nodemailer from "nodemailer";

export const transporter = () => {
  if (
    !process.env.EMAIL_SMTP_USER ||
    !process.env.EMAIL_SMTP_PASSWORD ||
    !process.env.EMAIL ||
    !process.env.EMAIL_SERVER ||
    !process.env.EMAIL_PORT
  ) {
    throw new Error(
      "EMAIL_SMTP_USER or EMAIL_SMTP_PASSWORD or EMAIL or process.env.EMAIL_SERVER or EMAIL_PORT not set"
    );
  }
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: parseInt(process.env.EMAIL_PORT, 10),
    secure: true,
    auth: {
      user: process.env.EMAIL_SMTP_USER,
      pass: process.env.EMAIL_SMTP_PASSWORD,
    },
  });
};
