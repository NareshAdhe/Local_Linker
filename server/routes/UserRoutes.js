import express from "express";
import {
  getUsers,
  getUsersByCity,
  profile,
  updateUser,
} from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.get("/get", authMiddleware, getUsers);
userRouter.get("/get/:location", authMiddleware, getUsersByCity);
userRouter.get("/profile", authMiddleware, profile);
userRouter.put("/update", authMiddleware, updateUser);
export default userRouter;
