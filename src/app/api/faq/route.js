import faqSchema from "@/model/faqSchema";
import { NextResponse } from "next/server";
const { asyncHandler } = require("@/utils/asyncHandler");

export const GET = asyncHandler(async () => {
  const result = await faqSchema.find();
  return NextResponse.json({
    isSuccess: true,
    data: result,
    message: "FAQ get successfully!",
  });
});
