import e from "express";
import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "provide password"],
    },
    profile_pic: {
      type: String,
      default:
        "https://res.cloudinary.com/daqnoky0k/image/upload/v1726211379/BuzzChat/t19k9frceygzadpfbbh9.jpg",
    },
    resetPasswordToken: String,
    resetPasswordExpiresAt: Date,
  },
  { timestamps: true }
);
const UserModel = mongoose.model("User", userSchema);
export default UserModel;
