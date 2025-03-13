const userModel = require("../models/userModel");

const getUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const users = await userModel
      .find({ _id: { $ne: loggedInUser } })
      .select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUsersByCity = async (req, res) => {
  try {
    const loggedInUser = req.user._id;
    const city = req.params.city;
    const users = await userModel
      .find({ _id: { $ne: loggedInUser }, city })
      .select("-password");

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getUsers };
