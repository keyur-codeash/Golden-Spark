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
    name: body.name,
  });
  if (existingColor) {
    return NextResponse.json(
      { isSuccess: false, message: "Color name already exists." },
      { status: 400 }
    );
  }

  const result = await colorSchema.create(body);
  return NextResponse.json({
    isSuccess: true,
    data: result,
    message: "Color added successfully",
  });
});