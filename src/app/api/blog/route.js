import blogSchema from "@/model/blogSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import genratePublicUrl from "@/utils/genratePublicUrl";
import { NextResponse } from "next/server";
const SAVE_PRODUCT_PATH = "backend/blog";

// Get blog
export const GET = asyncHandler(async () => {
  const result = await blogSchema.find();

  const details = result.map((item) => ({
    ...item.toObject(),
    image: genratePublicUrl(SAVE_PRODUCT_PATH, item.image),
  }));
  
  return NextResponse.json({
    isSuccess: true,
    data: details,
    message: "Blogs fetched successfully!",
  });
}); 
