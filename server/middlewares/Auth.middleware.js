import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export const AuthMiddleware = async (req, res, next) => {
  const token = req.cookies.token || "";
  try {
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please provide a token",
        logout: true,
      });
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: "Session expired",
        logout: true,
      });
    }

    req.user = await UserModel.findById(decoded.id).select("-password");

    next();
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "Internal server error",
      error: true,
    });
  }
};
