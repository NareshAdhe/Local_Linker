import express from "express";
import {
  changePassword,
  checkMail,
  getUser,
  login,
  logout,
  register,
  sendOtp,
  sendResetOtp,
  updatePassword,
  verifyOtp,
  verifyResetOtp,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import resetMiddleware from "../middlewares/resetMiddleware.js";
import verifyMiddleware from "../middlewares/verifyMiddleware.js";
const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.post("/resend", verifyMiddleware, sendOtp);
authRouter.post("/resend-reset", resetMiddleware, sendResetOtp);
authRouter.post("/verify", verifyMiddleware, verifyOtp);
authRouter.post("/verify-reset", resetMiddleware, verifyResetOtp);
authRouter.post("/checkMail", checkMail);
authRouter.post("/reset", resetMiddleware, changePassword);
authRouter.get("/user", authMiddleware, getUser);
authRouter.post("/updatePassword", authMiddleware, updatePassword);
export default authRouter;
