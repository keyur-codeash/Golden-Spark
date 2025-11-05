import deliveryDetails from "@/model/deliveryDetails";
import { NextResponse } from "next/server";
const { asyncHandler } = require("@/utils/asyncHandler");

export const GET = asyncHandler(async () => {
  const result = await deliveryDetails.find();
  return NextResponse.json({
    isSuccess: true,
    data: result,
    message: "Delivery details fetch successfully!",
  });
});
