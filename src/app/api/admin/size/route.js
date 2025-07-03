import { validate } from "@/lib/validateSchema";
import sizeSchema from "@/model/sizeSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  addSizeSchema,
} from "@/validation/sizeValidation";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async () => {
  const size = await sizeSchema.find().sort({ createdAt: -1 });
  return NextResponse.json({ isSuccess: true, data: size });
});

export const POST = asyncHandler(async (req) => {
  const body = await req.json();

  const { error } = validate(addSizeSchema, body);
  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 400 }
    );
  }

  const existingsize = await sizeSchema.findOne({
    size: body.size,
  });
  if (existingsize) {
    return NextResponse.json(
      { isSuccess: false, message: "Size already exists" },
      { status: 400 }
    );
  }

  const { size } = body;

  const result = await sizeSchema.create({ size });
  return NextResponse.json({
    isSuccess: true,
    data: result,
    message: "Size added successfully",
  });
});
