import express from "express";
import {
  sendVerificationCode,
  verifyVerificationCode,
  ResetPassword,
  ResetSuccuss,
  WelcomeEmail,
} from "../controller/mails.controller.js";
const router = express.Router();
router.post("/sent-verify-email", sendVerificationCode);
router.post("/verify-email", verifyVerificationCode);
router.post("/reset-password", ResetPassword);
router.post("/reset-success", ResetSuccuss);
router.post("/welcome-email", WelcomeEmail);
export default router;
