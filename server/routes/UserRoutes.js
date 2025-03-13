const express = require("express");
const { getUsers } = require("../controllers/user.controller");
const userRouter = express.Router();

userRouter.get("/get", getUsers);
userRouter.get("/get/:city", getUsersByCity);
module.exports = userRouter;
