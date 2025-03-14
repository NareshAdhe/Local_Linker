import express from "express";
import {
  getOtherUser,
  getUsers,
  getUsersByCity,
  profile,
  saveProfileImage,
  updateUser,
} from "../controllers/UserController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
const userRouter = express.Router();

userRouter.get("/get", authMiddleware, getUsers);
userRouter.get("/get/:location", authMiddleware, getUsersByCity);
userRouter.get("/profile", authMiddleware, profile);
userRouter.put("/update", authMiddleware, updateUser);
userRouter.post("/save-image", authMiddleware, saveProfileImage);
userRouter.get("/otherUser/:id", authMiddleware, getOtherUser);

export default userRouter;
