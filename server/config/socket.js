import { Server } from "socket.io";
import User from "../models/userModel.js";
import Message from "../models/messageModel.js";
import redis from "./redis.js";

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:5173",
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`🔗 New connection: ${socket.id}`);

    socket.on("join", async (userId) => {
      if (!userId) return;

      try {
        await redis.sadd(`userSockets:${userId}`, socket.id);
        await redis.set(`socketUser:${socket.id}`, userId);

        await User.findByIdAndUpdate(userId, { isOnline: true });
        io.emit("online", userId);

        const userUnReadCnt = await redis.hgetall(`unReadCount:${userId}`);
        if (userUnReadCnt && Object.keys(userUnReadCnt).length > 0) {
          io.to(socket.id).emit("unReadMessages", userUnReadCnt);
        }
      } catch (error) {
        console.error("Error in join event:", error);
      }
    });

    socket.on("sendMessage", async (messageObj) => {
      const { sender, receiver, message } = messageObj;
      if (!sender || !receiver || !message.trim()) return;

      try {
        const newMessage = new Message({ sender, receiver, message });
        await newMessage.save();

        const receiverSocketIds = await redis.smembers(
          `userSockets:${receiver}`
        ) || [];
        const senderSocketIds = await redis.smembers(`userSockets:${sender}`) || [];

        if (receiverSocketIds.length > 0) {
          const isChatOpened = await redis.get(`chat:${receiver}:${sender}`);
          if (isChatOpened) {
            newMessage.isRead = true;
            await newMessage.save();
          } else {
            // updated the unread count by 1
            await redis.hincrby(`unReadCount:${receiver}`, sender, 1);

            // sent unread count to the receiver when he is not present in the chat
            const userUnReadCnt = await redis.hget(
              `unReadCount:${receiver}`,
              sender
            );
            const count = Number(userUnReadCnt);
            receiverSocketIds.forEach((socketId) => {
              io.to(socketId).emit("updateUnreadCount", {
                sender,
                count,
              });
            });
          }
          receiverSocketIds.forEach((socketId) => {
            io.to(socketId).emit("newMessage", newMessage);
            io.to(socketId).emit("updateChatUsers", sender);
          });
        } else {
          console.log(
            "📡 Receiver is offline, message will be delivered later."
          );
          await redis.hincrby(`unReadCount:${receiver}`, sender, 1);
        }

        (senderSocketIds?.length ? senderSocketIds : [socket.id]).forEach(
          (socketId) => {
            io.to(socketId).emit("newMessage", newMessage);
            io.to(socketId).emit("updateChatUsers", receiver);
          }
        );
      } catch (error) {
        console.error("❌ Error in sendMessage event:", error);
      }
    });

    socket.on("chatJoined", async ({ sender, receiver }) => {
      try {
        console.log("📩 Chat joined:", sender, receiver);
        await redis.set(`chat:${sender}:${receiver}`, "true");
        await redis.hdel(`unReadCount:${sender}`, receiver);

        const senderSocketIds = await redis.smembers(`userSockets:${sender}`) || [];
        senderSocketIds.forEach((socketId) => {
          io.to(socketId).emit("updateUnreadCount", {
            sender: receiver,
            count: 0,
          });
        });

        await Message.updateMany(
          { sender: receiver, receiver: sender, isRead: false },
          { $set: { isRead: true } }
        );

        const updatedMessages = await Message.find({
          $or: [
            { sender, receiver },
            { sender: receiver, receiver: sender },
          ],
        }).sort({ createdAt: 1 });

        const receiverSocketIds = await redis.smembers(
          `userSockets:${receiver}`
        ) || [];

        receiverSocketIds.forEach((socketId) => {
          io.to(socketId).emit("getMessages", {
            updatedMessages,
            newSender: sender,
          });
        });
        io.to(socket.id).emit("getMessages", {
          updatedMessages,
          newSender: receiver,
        });
        if (receiverSocketIds.length > 0) {
          io.to(socket.id).emit("online", receiver);
        }
      } catch (error) {
        console.error("❌ Error in chatJoined event:", error);
      }
    });

    socket.on("leaveChat", async ({ sender, receiver }) => {
      try {
        await redis.del(`chat:${sender}:${receiver}`);
      } catch (error) {
        console.error("❌ Error in leaveChat event:", error);
      }
    });

    socket.on("disconnect", async () => {
      try {
        const userId = await redis.get(`socketUser:${socket.id}`);

        if (userId) {
          console.log(
            `🔴 User disconnected: ${userId} (Socket ID: ${socket.id})`
          );

          await redis.srem(`userSockets:${userId}`, socket.id);
          await redis.del(`socketUser:${socket.id}`);

          const date = new Date();

          await User.findByIdAndUpdate(userId, {
            isOnline: false,
            lastSeen: date,
          });
          io.emit("offline", { userId, isOnline: false, lastSeen: date });
        } else {
          console.log(`�� Socket disconnected: ${socket.id} (No user found)`);
        }
      } catch (error) {
        console.error("❌ Error handling disconnect:", error);
      }
    });
  });

  return io;
};

export default initSocket;
