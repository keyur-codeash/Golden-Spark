import blogSchema from "@/model/blogSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import genratePublicUrl from "@/utils/genratePublicUrl";
import { NextResponse } from "next/server";
const SAVE_PRODUCT_PATH = "backend/blog";

// Get blog
export const GET = asyncHandler(async (request, { params }) => {
  const { id } = params;
  const result = await blogSchema.findOne({ _id: id });
  const details = {
    ...result.toObject(),
    image: genratePublicUrl(SAVE_PRODUCT_PATH, result.image),
  };

  return NextResponse.json({
    isSuccess: true,
    data: details,
    message: "Blog fetched successfully!",
  });
});