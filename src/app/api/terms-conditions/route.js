import privacyPolicySchema from "@/model/privacyPolicySchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";
const FIELD = "TERMS_CONDITIONS";

// Terms & Conditions
export const GET = asyncHandler(async () => {
  const result = await privacyPolicySchema
    .findOne({ field: FIELD })
    .sort({ _id: -1 });
  return NextResponse.json({
    isSuccess: true,
    data: result,
    message: "Terms & Conditions fetched successfully!",
  });
});
