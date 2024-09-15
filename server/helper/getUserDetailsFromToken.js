import jwt from "jsonwebtoken";
import UserModel from "../models/user.model.js";

export const getUserDetailsFromToken = async (token) => {
  try {
    if (!token) {
      return {
        success: false,
        message: "Please provide a token",
        logout: true,
      };
    }

    const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded) {
      return {
        success: false,
        message: "Session expired",
        logout: true,
      };
    }

    const user = await UserModel.findById(decoded.id).select("-password");

    return {
      success: true,
      data: user,
      error: false,
    };
  } catch (err) {
    return {
      success: false,
      message: err.message || "Internal server error",
      error: true,
    };
  }
};
