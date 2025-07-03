import mongoose from "mongoose";

const userCardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      index: true,
    },
    cardName: {
      type: String,
      required: true,
      trim: true,
    },
    cardNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    cardExpirationDate: {
      type: String,
      required: true,
      trim: true,
    },
    cvv: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

// Prevent re-compilation during hot reloads
export default mongoose.models.card || mongoose.model("card", userCardSchema);
