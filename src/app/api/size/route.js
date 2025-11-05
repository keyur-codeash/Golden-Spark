import { validate } from "@/lib/validateSchema";
import sizeSchema from "@/model/sizeSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const size = await sizeSchema.find().sort({ createdAt: -1 });
  return NextResponse.json({
    isSuccess: true,
    data: size,
    message: "Size get successfuly!",
  });
});
