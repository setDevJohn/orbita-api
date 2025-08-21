import nodemailer from "nodemailer";
import { AppError, HttpStatus } from "./helpers/appError";
import path from "path";
import fs from "fs";

interface SendEmailProps {
  to: string;
  subject: string;
  htmlFileName: string;
  token: string;
}

const PORT = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

transporter.verify((error) => {
  if (error) {
    console.error("\nError on connect SMTP server", error);
  } else {
    console.log("\nServer SMTP connected");
  }
});

export const sendEmail = async ({
  to,
  subject,
  htmlFileName,
  token,
}: SendEmailProps) => {
  try {
    const templatePath = path.resolve(process.cwd(), "src", "templates", `${htmlFileName}.html`);
    let content = fs.readFileSync(templatePath, "utf-8");

    const currentYear = new Date().getFullYear().toString();
    const apiUrl = process.env.API_URL || 'https://localhost:3000'

    content = content.replace("{{token}}", token);
    content = content.replace("{{ano_atual}}", currentYear);
    content = content.replace("{{project_url}}", apiUrl)

    return transporter.sendMail({
      from: `"Suporte Órbita" <${process.env.SMTP_USER_FROM}>`,
      to,
      subject,
      html: content,
    });
  } catch (err) {
    console.error(`Erro ao enviar email para ${to}: `, err);
    throw new AppError("Erro ao enviar email", HttpStatus.INTERNAL_SERVER_ERROR);
  }
};
