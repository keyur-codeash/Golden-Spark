import { validate } from "@/lib/validateSchema";
import contactSchema from "@/model/contactSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { contactValidation } from "@/validation/contactValidation";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (request) => {
  const body = await request.json();
  const { error } = validate(contactValidation, body);

  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { status: 400 }
    );
  }
  const result = await contactSchema.create(body);

  return NextResponse.json(
    {
      isSuccess: true,
      data: result,
      message: "Contact form submitted successfully",
    },
    { status: 201 }
  );
});
