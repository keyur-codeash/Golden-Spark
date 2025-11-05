import { NextResponse } from "next/server";
import product_variants from "@/model/product_variants";
import { asyncHandler } from "@/utils/asyncHandler";
import { userAuthentication } from "@/middlewares/auth";

export const GET = asyncHandler(async (request) => {
  await userAuthentication(request);
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { isSuccess: false, message: "Missing product variant ID" },
      { status: 400 }
    );
  }

  try {
    const size = await product_variants.find({ _id: id });
    return NextResponse.json({
      isSuccess: true,
      data: size,
      message: "Size fetched successfully!",
    });
  } catch (error) {
    return NextResponse.json(
      { isSuccess: false, message: "Error fetching size", error },
      { status: 500 }
    );
  }
});
