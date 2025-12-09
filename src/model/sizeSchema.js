import mongoose from "mongoose";

const sizeSchema = new mongoose.Schema(
  {
    size: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
      status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },
  },
  { timestamps: true }
);

export default mongoose.models.size || mongoose.model("size", sizeSchema);
