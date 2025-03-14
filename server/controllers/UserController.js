import User, { Businessman, Influencer } from "../models/userModel.js";
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage }).single("profileImage");

export const updateUser = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.json({
        success: false,
        message: "File upload failed",
      });
    }

    try {
      const {
        name,
        location,
        number,
        businessName,
        industry,
        description,
        category,
        rating,
        userId,
      } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
        });
      }

      // Validate phone number (Indian 10-digit)
      const phoneRegex = /^[6-9]\d{9}$/;
      if (number && !phoneRegex.test(number)) {
        return res.status(400).json({
          success: false,
          message: "Invalid phone number",
        });
      }

      let user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Handle profile image upload
      const image = req.file ? `/uploads/${req.file.filename}` : user.image;

      const updatedData = { name, location, number, image };

      // Update user based on role
      if (user.role === "businessman") {
        user = await Businessman.findByIdAndUpdate(
          userId,
          { ...updatedData, businessName, industry, description },
          { new: true, runValidators: true }
        );
      } else if (user.role === "influencer") {
        user = await Influencer.findByIdAndUpdate(
          userId,
          { ...updatedData, category, rating },
          { new: true, runValidators: true }
        );
      } else {
        return res.status(400).json({
          success: false,
          message: "Invalid user role",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        user,
      });
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error",
      });
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
