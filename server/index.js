import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/connectDB.js";
import userRoute from "./routes/user.route.js";
import cookieParser from "cookie-parser";
import mailRoutes from "./routes/mails.route.js";
import { app, server } from "./socket/index.js";
dotenv.config();
// const app = express();
app.use(
  cors({
    origin: "https://buzzchat-frontend-9m6r.onrender.com/",
    credentials: true,
  })
);
const PORT = process.env.PORT || 8080;
// API End Points
app.use(express.json());
app.use(cookieParser());
app.set("view engine", "ejs");
app.use("/api", userRoute);
app.use("/api", mailRoutes);
app.all("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: true,
  });
});
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
  });
});
