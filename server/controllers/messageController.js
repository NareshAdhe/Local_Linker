import Message from "../models/messageModel.js";
import Redis from "ioredis";

const redis = new Redis();

export const getMessages = async (req, res) => {
  const { sender, receiver } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender },
      ],
    }).sort({ createdAt: 1 });

    res.json({
      success: true,
      messages,
    });
  } catch (error) {
    res.json({
      success: false,
      message: error,
    });
  }
};

export const sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;
  const io = req.io;

  if (!message.trim() || !sender || !receiver) return;

  try {
    const messageObj = { sender, receiver, message };
    const newMessage = new Message(messageObj);
    await newMessage.save();
    const receiverSocketId = await redis.get(receiver);
    const senderSocketId = await redis.get(sender);
    if (receiverSocketId) {
      newMessage.isRead = true;
      await newMessage.save();
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    io.to(senderSocketId).emit("newMessage", newMessage);
    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { sender, receiver } = req.body;
    const io = req.io;
    await Message.updateMany(
      { sender, receiver, isRead: false },
      { $set: { isRead: true }}
    );
    io.emit("messageRead",{sender,receiver});
    return res.json({ success: true });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};

