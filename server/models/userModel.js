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
    followers: { type: Number, default: 0 },
    image: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHVzZXJ8ZW58MHx8MHx8fDA%3D",
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
      rating: { type: Number, default: 0 },
    },
    { timestamps: true }
  )
);

export { Businessman, Influencer };
export default User;
