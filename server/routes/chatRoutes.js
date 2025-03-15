import { getMessages, markMessagesAsRead, sendMessage } from "../controllers/messageController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import express from "express";

const chatRouter = express.Router();

chatRouter.get("/messages/:sender/:receiver", authMiddleware, getMessages);
chatRouter.post("/send", authMiddleware, sendMessage);
chatRouter.post("/markAsRead", markMessagesAsRead);

export default chatRouter;
