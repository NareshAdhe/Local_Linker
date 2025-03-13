import express from "express";
import { getUsers, getUsersByCity } from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.get("/get", authMiddleware, getUsers);
userRouter.get("/get/:location", authMiddleware, getUsersByCity);
export default userRouter;
