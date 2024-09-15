import transporter from "./nodemiller.config.js";
import dotenv from "dotenv";
dotenv.config();
import {
  VERIFICATION_EMAIL_TEMPLATE,
  WELCOME_EMAIL_TEMPLATE,
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
} from "./emailTemplates.js";

// Reusable sender information
const sender = {
  name: "BuzzChat",
  address: process.env.USER_EMAIL,
};

export const sendVerificationEmail = async (recipient, verificationToken) => {
  try {
    console.log(verificationToken);
    console.log(sender);
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Email Verification",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "{verificationCode}",
        verificationToken
      ),
      category: "Email Verification",
    });
    console.log(
      `Verification email sent successfully to ${recipient}`,
      response
    );
  } catch (err) {
    console.error(`Error sending verification email to ${recipient}:`, err);
  }
};

export const sendWelcomeEmail = async (recipient, name) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Welcome to Our Platform",
      html: WELCOME_EMAIL_TEMPLATE.replace("{user_name}", name),
      category: "Welcome Email",
    });
    console.log(`Welcome email sent successfully to ${recipient}`, response);
  } catch (err) {
    console.error(`Error sending welcome email to ${recipient}:`, err);
  }
};

export const sendPasswordResetEmail = async (recipient, resetToken) => {
  try {
    const resetURL = `http://localhost:3000/forgot-password/${resetToken}`;
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Password Reset",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log(
      `Password reset email sent successfully to ${recipient}`,
      response
    );
  } catch (err) {
    console.error(`Error sending password reset email to ${recipient}:`, err);
  }
};

export const sendResetSuccessEmail = async (recipient) => {
  try {
    const response = await transporter.sendMail({
      from: sender,
      to: recipient,
      subject: "Password Reset Success",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });
    console.log(
      `Password reset success email sent successfully to ${recipient}`,
      response
    );
  } catch (err) {
    console.error(
      `Error sending password reset success email to ${recipient}:`,
      err
    );
  }
};
