import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.wishlist ||
  mongoose.model("wishlist", wishlistSchema);
