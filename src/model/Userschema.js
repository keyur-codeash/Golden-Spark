import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    userName: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    otp: { type: Number, default: null },
    role: { type: String, default: "user" },
    otpExpiresAt: { type: Date },
    isVerify: { type: Boolean, default: false },
    login_type: {
      type: String,
      enum: ["google", "facebook", "apple", "email"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);  