import { validate } from "@/lib/validateSchema";
import privacyPolicySchema from "@/model/privacyPolicySchema";
import { asyncHandler } from "@/utils/asyncHandler";
import genratePublicUrl from "@/utils/genratePublicUrl";
import {
  addBlogValidation,
  deleteBlogValidation,
} from "@/validation/blogValidation";
import { privacyPolicyValidation } from "@/validation/privacyValidation";
import { NextResponse } from "next/server";
const FIELD = "PRIVACY_POLICY";

// Add Privacy
export const POST = asyncHandler(async (req) => {
  try {
    const body = await req.json();
    body.field = FIELD;

    const { error } = validate(privacyPolicyValidation, body);
    if (error) {
      return NextResponse.json(
        { isSuccess: false, message: error },
        { status: 400 }
      );
    }

    let response;

    if (body._id) {
      response = await privacyPolicySchema.findOneAndUpdate(
        { _id: body._id },
        { $set: { content: body.content } },
        { new: true }
      );

      if (!response) {
        return NextResponse.json(
          { isSuccess: false, message: "Data not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { isSuccess: true, message: "Updated successfully", data: response },
        { status: 200 }
      );
    }
    response = await privacyPolicySchema.create(body);

    return NextResponse.json(
      { isSuccess: true, message: "Created successfully", data: response },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in POST /privacy-policy:", error);

    return NextResponse.json(
      { isSuccess: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});

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
