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

export default mongoose.models.size || mongoose.model("size", sizeSchema);
