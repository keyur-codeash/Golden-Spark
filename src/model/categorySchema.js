import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema(
  {
    name: {
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

export default mongoose.models.categorySchema ||
  mongoose.model("categorySchema", CategorySchema);
