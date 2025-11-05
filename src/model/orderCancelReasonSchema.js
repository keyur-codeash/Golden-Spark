import mongoose from "mongoose";

const orderCancelReasonSchema = new mongoose.Schema(
  {
    reason: { type: String, required: true },
    description: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.orderCancelReasons ||
  mongoose.model("orderCancelReasons", orderCancelReasonSchema);
