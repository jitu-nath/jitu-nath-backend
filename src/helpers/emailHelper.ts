/* eslint-disable @typescript-eslint/no-explicit-any */
import nodemailer from "nodemailer";
import config from "../app/config";

// import { errorLogger, logger } from '../shared/logger';

const transporter = nodemailer.createTransport({
  host: config.email.host,
  port: Number(config.email.port),
  secure: false,
  auth: {
    user: config.email.user,
    pass: config.email.pass,
  },
});

const sendEmail = async (values: any) => {
  try {
    const info = await transporter.sendMail({
      from: `Jitu nath ${config.email.from}`,
      to: values.to,
      subject: values.subject,
      html: values.html,
    });

    console.log("Mail send successfully", info.accepted);
  } catch (error) {
    console.error("Email", error);
  }
};

export const emailHelper = {
  sendEmail,
};
