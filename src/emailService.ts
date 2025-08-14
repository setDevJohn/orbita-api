import nodemailer from "nodemailer"
import { AppError, HttpStatus } from "./helpers/appError";

interface SendEmailProps {
  to: string,
  subject: string,
  html: string
}

const PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.error("\nError on connect SMTP server", error);
  } else {
    console.log("\nServer SMTP connected");
  }
});

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
  try {
    return transporter.sendMail({
      from: `"Orbita Finance" <${process.env.SMTP_USER_FROM}>`,
      to,
      subject,
      html,
    })

  } catch (err) {
    console.error(`Erro ao enviar email para ${to}: `, err)
    throw new AppError('Erro ao enviar email', HttpStatus.INTERNAL_SERVER_ERROR)
  }
}