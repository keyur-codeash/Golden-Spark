import mongoose from "mongoose";

const deliverySchema = new mongoose.Schema(
  {
    delivery: {
      type: Number,
      required: true,
      trim: true,
    },
    tax: {
      type: Number,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.deliveryDetails || 
  mongoose.model("deliveryDetails", deliverySchema);

