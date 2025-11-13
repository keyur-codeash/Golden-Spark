import categorySchema from "@/model/categorySchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const brands = await categorySchema.find().sort({ createdAt: -1 });
  return NextResponse.json({ isSuccess: true, data: brands });
});

export const POST = asyncHandler(async (req) => {
  try {
    const body = await req.json();
    const { name, status } = body;
    const newBrand = await categorySchema.create({ name, status });
    return NextResponse.json({ isSuccess: true, data: newBrand });
  } catch (error) {
    return NextResponse.json(
      { isSuccess: false, message: error.message },
      { status: 400 }
    );
  }
});
