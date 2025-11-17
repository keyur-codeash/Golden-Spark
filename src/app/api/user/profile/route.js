import { userAuthentication } from "@/middlewares/auth";
import Userschema from "@/model/Userschema";
import { NextResponse } from "next/server";
const { asyncHandler } = require("@/utils/asyncHandler");

export const GET = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const result = await Userschema.findOne({ _id: userId });
  return NextResponse.json({
    isSuccess: true,
    data: {
      _id: result._id,
      userName: result.userName,
      email: result.email,
    },
    message: "User profile details fetch successfully!",
  });
});
