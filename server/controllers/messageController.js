import Message from "../models/messageModel.js";
import Redis from "ioredis";

const redis = new Redis();

export const getMessages = async (req, res) => {
  const { sender, receiver } = req.params;
  console.log("Request for messages: ");

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
    res.status(500).json({ error: "Error fetching messages" });
  }
};

export const sendMessage = async (req, res) => {
  const { sender, receiver, message } = req.body;
  const io = req.io;

  if (!message.trim() || !sender || !receiver) return;

  if (typeof receiver !== "string") {
    console.error("Invalid receiver:", receiver);
    toast.error("Invalid receiver ID");
    return;
  }

  try {
    const newMessage = new Message(messageObj);
    await newMessage.save();
    const receiverSocketId = await redis.get(receiver);
    const senderSocketId = await redis.get(sender);
    io.to(senderSocketId).emit("newMessage", newMessage);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log("Message Stored in DB");
    }

    res.json({
      success: true,
      newMessage,
    });
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};
