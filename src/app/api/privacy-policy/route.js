import { validate } from "@/lib/validateSchema";
import privacyPolicySchema from "@/model/privacyPolicySchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { privacyPolicyValidation } from "@/validation/privacyValidation";
import { NextResponse } from "next/server";
const FIELD = "PRIVACY_POLICY";

// Get Privacy
export const GET = asyncHandler(async () => {
  const result = await privacyPolicySchema
    .findOne({ field: FIELD })
    .sort({ _id: -1 });
  return NextResponse.json({
    isSuccess: true,
    data: result,
    message: "Privecy fetched successfully!",
  });
});
