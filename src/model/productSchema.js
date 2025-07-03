// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: String,
    images: [String],
    description: String,
    category: String,
    brand: String,
    isFeatured: { type: Number, default: 0 },
    deleted: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);

// import mongoose from "mongoose";

// // Subdocument schema for a single variant
// const variantSchema = new mongoose.Schema({
//   size: { type: String, required: true },
//   color: { type: String, required: true },
//   price: { type: Number, required: true },
//   stock: { type: Number, default: 0 },
// });

// // Product schema
// const productSchema = new mongoose.Schema(
//   {
//     title: { type: String, required: true, trim: true },
//     price: { type: Number },
//     brand: { type: String },
//     images: { type: [String], default: [] },
//     description: { type: String, trim: true },
//     sku: { type: String },
//     deleted: { type: Number, default: 0 },
//     stock: { type: Number, default: 0 },
//     order: { type: Number, default: 1 },
//     featured: { type: Number, default: 0 },
//     variants: { type: [variantSchema], default: [] },
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// export default mongoose.models.product ||
//   mongoose.model("product", productSchema);

// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     price: { type: Number },
//     brand: { type: String },
//     images: { type: Array, default: [] },
//     description: { type: String, trim: true },
//     sku: { type: String },
//     deleted: { type: Number, default: 0 },
//     stock: { type: Number, default: 0 },
//     order: { type: Number, default: 1 },
//     featured: { type: Number, default: 0 },
//     variants: { type: Array, default: [] }, // ✅ Fixed here
//   },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// export default mongoose.models.product ||
//   mongoose.model("product", productSchema);

// import mongoose from "mongoose";

// const productSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     price: { type: Number },
//     brand: { type: String },
//     images: { type: Array, default: [] },
//     description: { type: String, trim: true },
//     sku: { type: String },
//     deleted: { type: Number, default: 0 },
//     stock: { type: Number, defalt: 0 },
//     order: { type: Number, default: 1 },
//     featured: { type: Number, default: 0 },
// variants: { type: Array, default: [] },
//  },
//   {
//     timestamps: true,
//     versionKey: false,
//   }
// );

// // Use a capitalized, singular model name: "User"
// export default mongoose.models.product ||
//   mongoose.model("product", productSchema);
