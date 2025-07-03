import mongoose from "mongoose";

const addressSchema = new mongoose.Schema(
  {
    email: { type: String, require: true },
    user: { type: mongoose.Schema.Types.ObjectId, require: true },
    type: { type: String, require: true },
    country: { type: String, require: true },
    address: { type: String, require: true },
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    city: { type: String, require: true },
    state: { type: String, require: true },
    zipCode: { type: String, require: true },
    isDefault: { type: Boolean, require: true },
  },
  { timestamps: true }
);
export default mongoose.models.address ||
  mongoose.model("address", addressSchema);
