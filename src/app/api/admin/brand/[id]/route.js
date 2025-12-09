import Brand from "@/model/brandSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async (_, { params }) => {
  try {
    const brand = await Brand.findById(params.id);
    if (!brand) throw new Error("Brand not found");
    return NextResponse.json({ isSuccess: true, data: brand });
  } catch (error) {
    return NextResponse.json(
      { isSuccess: false, message: error.message },
      { status: 404 }
    );
  }
});

export const PUT = asyncHandler(async (req, { params }) => {
  try {
    const body = await req.json();
    const { name, status } = body;

    const existingBrand = await Brand.findOne({
      name,
      status: 1,
      _id: { $ne: params.id },
    });

    if (existingBrand) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: `Brand with name '${name}' already exists.`,
        },
        { status: 409 }
      );
    }

    // Update brand
    const updatedBrand = await Brand.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedBrand) {
      return NextResponse.json(
        { isSuccess: false, message: "Brand not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ isSuccess: true, data: updatedBrand });
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "An unexpected error occurred while updating the brand.",
      },
      { status: 500 }
    );
  }
});

export const DELETE = asyncHandler(async (_, { params }) => {
  try {
    const deletedBrand = await Brand.findByIdAndDelete(params.id);
    if (!deletedBrand) throw new Error("Brand not found");
    return NextResponse.json({
      isSuccess: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { isSuccess: false, message: error.message },
      { status: 400 }
    );
  }
});
