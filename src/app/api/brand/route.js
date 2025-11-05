import brandSchema from "@/model/brandSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const brands = await brandSchema.find().sort({ createdAt: -1 });
  return NextResponse.json({
    isSuccess: true,
    data: brands,
    message: "Brand get successfuly!",
  });
});
