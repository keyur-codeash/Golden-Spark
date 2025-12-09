import connectToDB from "@/lib/dbConnect";
import { validate } from "@/lib/validateSchema";
import sizeSchema from "@/model/sizeSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { idParamSchema } from "@/validation/sizeValidation";
import { updateSizeSchema } from "@/validation/sizeValidation";
// import { idParamSchema, updatesizeSchema } from "@/validation/sizeValidation";
import { NextResponse } from "next/server";

export const PUT = asyncHandler(async (req, { params }) => {
  const body = await req.json();
  const { value, error } = validate(updateSizeSchema, body);
  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 422 }
    );
  }

  const existingBrand = await sizeSchema.findOne({
    size: value.size,
    status: 1,
    _id: { $ne: params.id },
  });

  if (existingBrand) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: `Size already exists.`,
      },
      { status: 409 }
    );
  }

  const updatedSize = await sizeSchema.findByIdAndUpdate(params.id, value, {
    new: true,
    runValidators: true,
  });

  if (!updatedSize) throw new Error("Size not found");

  return NextResponse.json({
    isSuccess: true,
    data: updatedSize,
    message: "Size updated successfully",
  });
});

export const DELETE = asyncHandler(async (_, { params }) => {
  const { error } = validate(idParamSchema, params);
  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 400 }
    );
  }

  const deletedsizeSchema = await sizeSchema.findByIdAndDelete(params.id);
  if (!deletedsizeSchema) {
    return NextResponse.json({
      isSuccess: true,
      message: "Size not found",
    });
  }
  return NextResponse.json({
    isSuccess: true,
    message: "Size deleted successfully",
  });
});
