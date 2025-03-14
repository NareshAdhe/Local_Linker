import User, { Businessman, Influencer } from "../models/userModel.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage }).single("profileImage");
export const updateUser = async (req, res) => {
  const userId = req.body.userId;

  upload(req, res, async (err) => {
    if (err) {
      return res.json({
        success: false,
        message: err.message || "File upload failed",
      });
    }

    try {
      req.body.userId = userId;

      const {
        name,
        location,
        number,
        businessName,
        industry,
        description,
        category,
        rating,
        image,
      } = req.body;

      if (!userId) {
        return res.json({ success: false, message: "User ID is required" });
      }

      const phoneRegex = /^[6-9]\d{9}$/;
      if (number && !phoneRegex.test(number)) {
        return res.json({ success: false, message: "Invalid phone number" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }

      const BufferImage = req.file
        ? `data:${req.file.mimetype};base64,${req.file.buffer.toString(
            "base64"
          )}`
        : image;

      const updatedData = { name, location, number, BufferImage };

      let updatedUser;
      if (user.role === "businessman") {
        updatedUser = await Businessman.findByIdAndUpdate(
          userId,
          { ...updatedData, businessName, industry, description },
          { new: true, runValidators: true }
        );
      } else if (user.role === "influencer") {
        updatedUser = await Influencer.findByIdAndUpdate(
          userId,
          { ...updatedData, category, rating },
          { new: true, runValidators: true }
        );
      } else {
        return res.json({ success: false, message: "Invalid user role" });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      return res.json({ success: false, message: "Internal server error" });
    }
  });
};

export const getUsers = async (req, res) => {
  try {
    const { userId } = req.body;

    let query = { _id: { $ne: userId } };
    const users = await User.find(query).select("-password");

    res.json({
      success: true,
      users,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
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

    res.json({ success: true, Users });
  } catch (error) {
    res.json({ success: false, message: "Server Error" });
  }
};

export const profile = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({
      success: true,
      user,
    });
  } catch (error) {
    return res.json({ success: false, message: error });
  }
};
