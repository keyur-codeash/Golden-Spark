import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    images: [String],
    description: String,
    category: String,
    brand: String,
    sku: String,
    isFeatured: { type: Number, default: 0 },
    isDeleted: { type: Number, default: 0 },
    isAvailable: { type: Number, default: 1 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
