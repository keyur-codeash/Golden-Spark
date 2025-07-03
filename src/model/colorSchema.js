import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    color: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Avoid re-defining model during hot reload
export default mongoose.models.color || mongoose.model("color", colorSchema);
