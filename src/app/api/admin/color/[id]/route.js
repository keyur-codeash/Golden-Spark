import { validate } from "@/lib/validateSchema";
import colorSchema from "@/model/colorSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { idParamSchema, updateColorSchema } from "@/validation/colorValidation";
import { NextResponse } from "next/server";

export const PUT = asyncHandler(async (req, { params }) => {
  const body = await req.json();
  const { value, error } = validate(updateColorSchema, body);
  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 422 }
    );
  }

  const updatedColor = await colorSchema.findByIdAndUpdate(params.id, value, {
    new: true,
    runValidators: true,
  });

  if (!updatedColor) throw new Error("Color not found");

  return NextResponse.json({
    isSuccess: true,
    data: updatedColor,
    message: "Color updated successfully",
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

  const deletedcolorSchema = await colorSchema.findByIdAndDelete(params.id);
  if (!deletedcolorSchema) {
    return NextResponse.json({
      isSuccess: true,
      message: "Color not found",
    });
  }
  return NextResponse.json({
    isSuccess: true,
    message: "Color deleted successfully",
  });
});
