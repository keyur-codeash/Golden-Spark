import { userAuthentication } from "@/middlewares/auth";
import addressSchema from "@/model/addressSchema";
import { NextResponse } from "next/server";
const { asyncHandler } = require("@/utils/asyncHandler");

// Get address
export const GET = asyncHandler(async (request) => {
  const user = await userAuthentication(request);
  const result = await addressSchema.find({ user: user.id, isDefault: true });
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Address get successdully!", 
    });
  }
});
