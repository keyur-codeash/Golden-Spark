// models/Variant.js
import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    size: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "sizes",
      required: true,
    },
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "colors",
      required: true,
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.models.Variant ||
  mongoose.model("Variant", variantSchema);
