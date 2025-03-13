import User from "../models/userModel.js";

export const getUsers = async (req, res) => {
  try {
    const { userId } = req.body;

    let query = { _id: { $ne: userId } };
    const users = await User.find(query).select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getUsersByCity = async (req, res) => {
  try {
    const { location } = req.params;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    console.log("Fetching influencers for location:", location);
    const Users = await User.find({
      location: { $regex: location, $options: "i" },
    });

    if (Users.length === 0) {
      return res
        .status(404)
        .json({ message: "No influencers found for this location" });
    }

    res.status(200).json(Users);
  } catch (error) {
    console.error("❌ Error fetching influencers:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
