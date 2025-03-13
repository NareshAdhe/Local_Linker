import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    loginOtp: { type: String, default: "" },
    loginOtpExpiry: { type: Number, default: 0 },
    resetOtp: { type: String, default: "" },
    resetOtpExpiry: { type: Number, default: 0 },
    location: { type: String, default: "", trim: true },
    number: { type: String, trim: true, maxlength: 10 },
    role: {
      type: String,
      required: true,
      enum: ["businessman", "influencer"],
    },
  },
  { timestamps: true, discriminatorKey: "role" }
);

const User = mongoose.model("User", userSchema);

const Businessman = User.discriminator(
  "businessman",
  new Schema(
    {
      businessName: { type: String, trim: true },
      industry: { type: String, trim: true },
      description: { type: String, trim: true },
    },
    { timestamps: true }
  )
);

const Influencer = User.discriminator(
  "influencer",
  new Schema(
    {
      category: { type: String },
      followers: { type: Number, default: 0 },
      rating: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);

export { Businessman, Influencer };
export default User;
