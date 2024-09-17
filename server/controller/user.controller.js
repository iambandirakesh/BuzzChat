import bcrypt from "bcryptjs";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, profile_pic } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide all fields",
        error: true,
      });
    }
    const checkEmail = await UserModel.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
        error: true,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const payload = {
      name,
      email,
      password: hashedPassword,
      profile_pic,
    };
    const user = await UserModel.create(payload);
    return res.status(200).json({
      success: true,
      message: "user created successfully",
      error: false,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      error: true,
    });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "please provide email and password",
        error: true,
      });
    }
    const userData = await UserModel.findOne({ email });
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "User not Exist",
        error: true,
      });
    }
    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }
    const tokenData = {
      id: userData._id,
      email: userData.email,
    };
    const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {
      expiresIn: "1d",
    });
    const cookieOptions = {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    };
    return res.cookie("token", token, cookieOptions).status(200).json({
      success: true,
      message: "user logged in successfully",
      error: false,
      token: token,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      error: true,
    });
  }
};
export const userDetails = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "user not found",
        error: true,
      });
    }
    return res.status(200).json({
      success: true,
      message: "user details",
      error: false,
      data: user,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      error: true,
    });
  }
};
export const logout = async (req, res) => {
  try {
    const tokenData = {
      id: userData._id,
      email: userData.email,
    };
    return res.clearCookie("token", "", tokenData).status(200).json({
      success: true,
      message: "user logged out successfully",
      error: false,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      error: true,
    });
  }
};
export const updateUserDetails = async (req, res) => {
  try {
    const userData = req.user;
    const newData = req.body;
    if (!userData) {
      return res.status(400).json({
        success: false,
        message: "user not found",
        error: true,
      });
    }
    await UserModel.updateOne({ _id: userData._id }, newData);
    const userInfomation = await UserModel.findById(userData._id);
    return res.status(200).json({
      success: true,
      message: "user details updated successfully",
      error: false,
      data: userInfomation,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message || "internal server error",
      error: true,
    });
  }
};
