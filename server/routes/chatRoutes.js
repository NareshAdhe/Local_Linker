import { getMessages } from "../controllers/messageController.js";
import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

const chatRouter = express.Router();

chatRouter.get("/:sender/:receiver", authMiddleware , getMessages);
export default chatRouter;