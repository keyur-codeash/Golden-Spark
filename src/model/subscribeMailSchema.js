import mongoose from "mongoose";

const subcribMailSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.subscribeMail ||
  mongoose.model("subscribeMail", subcribMailSchema);
