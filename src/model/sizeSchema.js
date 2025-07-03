import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  { timestamps: true }
);

// Avoid re-defining model during hot reload
export default mongoose.models.size || mongoose.model("size", sizeSchema);
