import blogSchema from "@/model/blogSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

// Get blog
export const GET = asyncHandler(async () => {
  const result = await blogSchema.find();
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Blog get successfully!",
    });
  }
});
