import nodemailer from "nodemailer";
import { SMTP_FROM, SMTP_HOST, SMTP_PASS, SMTP_PORT, SMTP_USER } from "../config/constants";
import { logger } from "./logger";

let transporter: nodemailer.Transporter | null = null;

const isEmailConfigured = (): boolean =>
  Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && SMTP_FROM && SMTP_HOST.trim() !== "");

const getTransporter = (): nodemailer.Transporter | null => {
  if (!isEmailConfigured()) {
    logger.warn("SMTP is not configured. Skipping email sending.");
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
};

export const sendAdminWelcomeEmail = async (params: {
  to: string;
  displayName: string;
  password: string;
}) => {
  const tx = getTransporter();
  if (!tx) return;

  const subject = "Your KidZone Admin Account";
  const text = [
    `Hi ${params.displayName || "Admin"},`,
    "",
    "An administrator has created an account for you on the KidZone Library Management System.",
    "",
    `Email: ${params.to}`,
    `Temporary password: ${params.password}`,
    "",
    "Please log in as soon as possible and change your password from the profile settings.",
    "",
    "If you did not expect this email, please contact your system administrator.",
  ].join("\n");

  const html = text.replace(/\n/g, "<br/>");

  try {
    await tx.sendMail({
      from: SMTP_FROM,
      to: params.to,
      subject,
      text,
      html,
    });
    logger.info(`Welcome email sent to admin ${params.to}.`);
  } catch (err) {
    logger.error("Failed to send welcome email to admin:", err);
  }
};

export const generateRandomPassword = (length: number = 12): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  let pwd = "";
  for (let i = 0; i < length; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return pwd;
};

