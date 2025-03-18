import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: String, required: true },
  receiver: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: new Date() },
  isRead: { type: Boolean, default: false },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;
