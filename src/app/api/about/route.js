import aboutSchema from "@/model/aboutSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import genratePublicUrl from "@/utils/genratePublicUrl";
import { NextResponse } from "next/server";
const SAVE_PRODUCT_PATH = "backend/product";

// Get about
 const GET = asyncHandler(async () => {
  const result = await aboutSchema.find();

  const data = result.map((item) => ({
    ...item.toObject(),
    image: genratePublicUrl(SAVE_PRODUCT_PATH, item.image),
  }));

  return NextResponse.json({
    isSuccess: true,
    data,
    message: "About fetched successfully!",
  });
});

