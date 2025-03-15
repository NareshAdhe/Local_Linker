import { Server } from "socket.io";
import Redis from "ioredis";
import Message from "../models/messageModel.js";

const redis = new Redis();

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
    },
  });

  io.on("connection", (socket) => {

    socket.on("join", async (sender) => {
      await redis.set(sender, socket.id);

      const unreadMessages = await Message.find({
        receiver: sender,
        isRead: false,
      });

      unreadMessages.forEach((msg) => {
        io.to(socket.id).emit("newMessage", msg);
      });

      await Message.updateMany(
        { receiver: sender, isRead: false },
        { isRead: true }
      );
    });

    socket.on("disconnect", async () => {
      const keys = await redis.keys("*");

      for (const key of keys) {
        const storedSocketId = await redis.get(key);
        if (storedSocketId === socket.id) {
          await redis.del(key);
          break;
        }
      }
    });
  });
  return io;
};

export default initSocket;
