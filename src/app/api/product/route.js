import { userAuthentication } from "@/middlewares/auth";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

userAuthentication();

export const POST = asyncHandler(async (req) => {
  // const user = req.body.id;
  // console.log(user);
  userAuthentication();

  NextResponse.json({ msg: "hellow" });
});
