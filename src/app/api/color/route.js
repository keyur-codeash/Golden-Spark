import colorSchema from "@/model/colorSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const color = await colorSchema.find().sort({ createdAt: -1 });
  return NextResponse.json({
    isSuccess: true,
    data: color,
    message: "Color address successfully!",
  });
});
  