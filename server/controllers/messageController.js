import Message from "../models/messageModel.js";

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

  try {
    const newMessage = new Message({ sender, receiver, message });
    await newMessage.save();
    io.emit("newMessage", newMessage);

    res.json(newMessage);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};
