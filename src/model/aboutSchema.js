import mongoose from "mongoose";

const aboutSchema = new mongoose.Schema(
  {
    heading: { type: String, require: true },
    image: { type: String, require: true },
    sub_heading: { type: String, require: true },
    content: { type: String, require: true },
  },
  { timestamps: true }
);

export default mongoose.models.about || mongoose.model("about", aboutSchema);
    