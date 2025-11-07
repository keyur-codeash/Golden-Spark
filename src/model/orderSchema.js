import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      required: true,
    },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    deliveryFee: { type: Number, required: false, default: 0 },
    tax: { type: Number, required: false },
    total: { type: Number, required: false, default: 0 },
    type: { type: String, required: false },
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    zipCode: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["Cash", "Card", "UPI", "PayPal"],
      required: true,   
    },
    cancel: { type: Number, default: 0, enum: [0, 1] },
    cancelReason: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CancelReason",
      required: false,
    },
    cancelDescription: { type: String, required: false },
    orderId: { type: Number, required: false, default: 0 },
    status: {
      type: String,
      enum: ["Pending", "Shipped", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.order || mongoose.model("order", orderSchema);
