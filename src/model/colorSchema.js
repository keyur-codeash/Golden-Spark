import mongoose from "mongoose";

const colorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    color: {
      type: String,
      required: true,
      trim: true,
    },
  status: {
      type: Number,
      enum: [0, 1],
      default: 1,
    },  },
  { timestamps: true }
);

export default mongoose.models.color || mongoose.model("color", colorSchema);
