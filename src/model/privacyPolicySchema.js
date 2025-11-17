import mongoose from "mongoose";

const privacySchema = new mongoose.Schema(
  {
    field: { type: String, required: true },
    content: { type: String, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.models.policies ||
  mongoose.model("policies", privacySchema);
