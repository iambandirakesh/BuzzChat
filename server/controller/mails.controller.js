import {
  sendPasswordResetEmail,
  sendVerificationEmail,
  sendResetSuccessEmail,
  sendWelcomeEmail,
} from "../mails/emails.js";
import UserModel from "../models/user.model.js";
import verificationTokenModel from "../models/verification.token.model.js";
import crypto from "crypto";
import bcryptjs from "bcryptjs";
export const sendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;
    console.log(email);
    const verificationToken = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    let code = await verificationTokenModel.findOne({ email: email });
    if (code) {
      await verificationTokenModel.findOneAndDelete({ email: email });
    }

    await sendVerificationEmail(email, verificationToken);
    await verificationTokenModel.create({
      email: email,
      verificationToken: verificationToken,
    });

    res.status(200).send({
      success: true,
      message: "Email Verification code Sent",
    });
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
export const verifyVerificationCode = async (req, res) => {
  try {
    const { email, userVerificationToken } = req.body;
    console.log(email, userVerificationToken);
    const verificationToken = await verificationTokenModel.findOne({
      email: email,
    });
    if (verificationToken.verificationToken == userVerificationToken) {
      await verificationTokenModel.findOneAndDelete({ email: email });
      res.status(200).send({ success: true, message: "Email Verified" });
    } else {
      res.status(401).send({
        success: false,
        message: "Invalid Verification Token",
      });
    }
  } catch (err) {
    res.status(500).send({ success: false, message: err.message });
  }
};
export const ResetPassword = async (req, res) => {
  let user = await UserModel.findOne({ email: req.body.email });
  try {
    if (!user) {
      return res
        .status(401)
        .send({ success: false, message: "User does not exist" });
    }
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetPasswordExpiresAt;
    await user.save();
    await sendPasswordResetEmail(user.email, resetToken);
    res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
export const ResetSuccuss = async (req, res) => {
  const { resetToken, newPassword } = req.body;
  console.log(resetToken, newPassword);
  try {
    const user = await UserModel.findOne({
      resetPasswordToken: resetToken,
    });
    console.log(user);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "Invalid or expired token",
      });
    }
    const hashedPassword = await bcryptjs.hash(newPassword, 10);
    await UserModel.findOneAndUpdate(
      { resetPasswordToken: resetToken },
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordExpiresAt: null,
        },
      }
    );
    console.log("Updated");
    await sendResetSuccessEmail(user.email);
    res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: err,
    });
  }
};
export const WelcomeEmail = async (req, res) => {
  try {
    const { email, name } = req.body;
    await sendWelcomeEmail(email, name);
    res.status(200).send({
      success: true,
      message: "Email Sent",
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: "Internal Server Error",
    });
  }
};
