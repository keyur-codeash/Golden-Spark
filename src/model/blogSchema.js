import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    image: { type: String, require: true },
    heading: { type: String, require: true },
    content: { type: String, require: true },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.models.blog || mongoose.model("blog", blogSchema);
