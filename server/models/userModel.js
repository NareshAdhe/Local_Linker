import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, trim: true },
    // customerType: { type: String, required: true, trim: true },
    loginOtp: { type: String, default: "" },
    loginOtpExpiry: { type: Number, default: 0 },
    resetOtp: { type: String, default: "" },
    resetOtpExpiry: { type: Number, default: 0 },
    standAloneELocalLinkere: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const userModel = mongoose.models.user || mongoose.model("user", userSchema);
export default userModel;
