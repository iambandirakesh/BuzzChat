import express from "express";
import { createServer } from "http"; // Correct import from http
import { Server } from "socket.io";
import { getUserDetailsFromToken } from "../helper/getUserDetailsFromToken.js";
import UserModel from "../models/user.model.js";
export const app = express();
export const server = createServer(app); // Correct way to create the server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});
//Online User
const OnlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("User connected", socket.id); // Correct usage of socket.id to identify user
  const token = socket.handshake.auth.token;

  //current user Details
  const user = await getUserDetailsFromToken(token);

  //create a room
  socket.join(user?.data?._id);
  OnlineUser.add(user?.data?._id?.toString());
  console.log(user.data._id);
  io.emit("onlineUser", Array.from(OnlineUser));
  socket.on("message-page", async (userId) => {
    const userDetails = await UserModel.findById(userId).select("-password");
    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      profile_pic: userDetails?.profile_pic,
      online: OnlineUser.has(userId),
    };
    socket.emit("message-user", payload);
  });
  // Handle disconnection
  socket.on("disconnect", () => {
    OnlineUser.delete(user?.data?._id);
    console.log("User disconnected", socket.id);
  });
});
