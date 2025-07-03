import { validate } from "@/lib/validateSchema";
import colorSchema from "@/model/colorSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  addColorSchema,
} from "@/validation/colorValidation";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async(req) => {

  const color = await colorSchema.find().sort({ createdAt: -1 });
  return NextResponse.json({ isSuccess: true, data: color });
})

export const POST = asyncHandler(async (req) => {
  const body = await req.json();

  const { error } = validate(addColorSchema, body);
  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 400 }
    );
  }

  const existingColor = await colorSchema.findOne({
    color: body.color,
  });
  if (existingColor) {
    return NextResponse.json(
      { isSuccess: false, message: "Color already exists" },
      { status: 400 }
    );
  }

  const { color } = body;

  const result = await colorSchema.create({ color });
  return NextResponse.json({
    isSuccess: true,
    data: result,
    message: "Color added successfully",
  });
});
