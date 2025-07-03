import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    payment_type: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.payment ||
  mongoose.model("payment", paymentSchema);
