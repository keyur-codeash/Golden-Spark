import mongoose from "mongoose";

const trackOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: Number,
      required: true,
      trim: true,
    },
    arrivingBy: {
      type: String,
      required: true,
      trim: true,
    },
    shipped: {
      type: String,
      required: true,
      trim: true,
    },
    shipped_date: {
      type: String,
      required: true,
      trim: true,
    },
    events: {
      type: Array,
      required: true,
      trim: true,
      default: [],
    },
  },
  { timestamps: true }
);

// Avoid re-defining model during hot reload
export default mongoose.models.trackOrder ||
  mongoose.model("trackOrder", trackOrderSchema);
