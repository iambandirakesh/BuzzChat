import express from "express";
import {
  login,
  registerUser,
  userDetails,
  logout,
  updateUserDetails,
} from "../controller/user.controller.js";
import { AuthMiddleware } from "../middlewares/Auth.middleware.js";
import { searchUser } from "../controller/searchUser.js";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", login);
router.get("/user-details", AuthMiddleware, userDetails);
router.get("/logout", AuthMiddleware, logout);
router.put("/update-user", AuthMiddleware, updateUserDetails);
router.post("/search-user", searchUser);
export default router;
