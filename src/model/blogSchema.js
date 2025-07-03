import mongoose from "mongoose";

const blogSchema = new mongoose.Schema(
  {
    content: { type: String, require: true },
  },
  { timestamps: true }
);

export default mongoose.models.blog || mongoose.model("blog", blogSchema);



