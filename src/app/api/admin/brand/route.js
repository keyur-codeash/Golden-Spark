import brandSchema from "@/model/brandSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
  try {
    const body = await req.json();
    const { name, status } = body;

    // Check if brand already exists (active brands only)
    const existingBrand = await brandSchema.findOne({ name, status: 1 });
    if (existingBrand) {
      return NextResponse.json(
        { isSuccess: false, message: `Brand with name '${name}' already exists.` },
        { status: 409 }
      );
    }

    // Create brand
    const newBrand = await brandSchema.create({ name, status });
    return NextResponse.json({ isSuccess: true, data: newBrand });
  } catch (error) {
    console.error("Error creating brand:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Something went wrong.",
      },
      { status: 500 }
    );
  }
});


export const GET = asyncHandler(async () => {
  const brands = await brandSchema.find().sort({ createdAt: -1 });
  return NextResponse.json({
    isSuccess: true,
    data: brands,
    message: "Brand get successfuly!",
  });
});

