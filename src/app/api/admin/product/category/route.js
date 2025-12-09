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

    const existingCategory = await categorySchema.findOne({ name, status: 1 });
    if (existingCategory) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: `Category with name '${name}' already exists.`,
        },
        { status: 409 }
      );
    }

    const newCategory = await categorySchema.create({ name, status });
    return NextResponse.json({ isSuccess: true, data: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "An unexpected error occurred while creating the category.",
      },
      { status: 500 }
    );
  }
});
