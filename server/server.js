import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import cors from "cors";
import connectDB from "./config/connectDB.js";
import dotenv from "dotenv";
import userRouter from "./routes/UserRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import { Server } from "socket.io";
import http from "http";

dotenv.config();

const app = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Pass io to chat routes
app.use(
  "/api/chat",
  (req, res, next) => {
    req.io = io;
    next();
  },
  chatRouter
);

app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "An internal server error occurred",
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`App running at http://localhost:${PORT}...`);
});
