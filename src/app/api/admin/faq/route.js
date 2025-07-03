import { validate } from "@/lib/validateSchema";
import faqSchema from "@/model/faqSchema";
import { addfaqValidation } from "@/validation/faqValidation";
import { NextResponse } from "next/server";
const { asyncHandler } = require("@/utils/asyncHandler");

export const POST = asyncHandler(async (request) => {
  const body = await request.json();

  // Validate with common function
  const { error } = validate(addfaqValidation, body);
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  const faqExist = await faqSchema.findOne({ question: body.question });

  if (faqExist) {
    return NextResponse.json({
      isSuccess: false,
      message: "This Question is already added",
    });
  }
  const result = await faqSchema.create(body);
  return NextResponse.json({ isSuceess: true, result: result });
});

export const DELETE = asyncHandler(async (request) => {
  const url = new URL(request.url);
  const faqId = url.searchParams.get("id");
  console.log(faqId);

  const { error } = validate(addfaqValidation);
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  const faqExist = await faqSchema.findOne({ _id: faqId });

  if (!faqExist) {
    return NextResponse.json({
      isSuccess: false,
      message: "Invalid id",
    });
  }

  const result = await faqSchema.deleteOne({ _id: faqId });
  return NextResponse.json({
    isSuceess: true,
    meesage: "FAQ deleted successfull",
  });
});

export const GET = asyncHandler(async () => {
  const result = await faqSchema.find();
  return NextResponse.json({ isSuceess: true, result: result });
});
