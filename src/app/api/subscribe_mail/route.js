import { validate } from "@/lib/validateSchema";
import subscribeMailSchema from "@/model/subscribeMailSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { sibscribeMailvalidation } from "@/validation/privacyValidation";
import { NextResponse } from "next/server";

export const POST = asyncHandler(async (req) => {
  const body = await req.json();
  const { email } = body;

  const { error } = validate(sibscribeMailvalidation, { email });
  console.log("erroror==", error);

  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 400 }
    );
  }

  const alreadySubscribed = await subscribeMailSchema.findOne({ email });

  if (alreadySubscribed) {
    return NextResponse.json({
      isSuccess: true,  
      message: "Thanks! You're subscribed.",    
    });
  }

  await subscribeMailSchema.create({ email });

  return NextResponse.json({
    isSuccess: true,
    message: "Thanks! You're subscribed.",
  });
});
