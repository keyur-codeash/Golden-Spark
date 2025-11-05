import { NextResponse } from "next/server";
import User from "@/model/Userschema";
import { validate } from "@/lib/validateSchema";
import { otpSchema } from "@/validation/authValidation";
import { asyncHandler } from "@/utils/asyncHandler";

// export async function POST(request) {
export const POST = asyncHandler(async (request) => {
  try {
    const body = await request.json();
    const { value, error } = validate(otpSchema, body);
    if (error) {
      return NextResponse.json(
        { message: error, isSuccess: false },
        { status: 400 }
      );
    }
    const { email, otp } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User not found", isSuccess: false },
        { status: 404 }
      );
    }

    if (!user.otp || !user.otpExpiresAt) {
      return NextResponse.json(
        { message: "OTP not requested or already used", isSuccess: false },
        { status: 400 }
      );
    }

    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { message: "OTP has expired", isSuccess: false },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { message: "Invalid OTP", isSuccess: false },
        { status: 400 }
      );
    }

    user.isVerify = true;
    user.otp = null;
    user.otpExpiresAt = null;
    await user.save();

    return NextResponse.json(
      { message: "OTP verified successfully", isSuccess: true },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", isSuccess: false },
      { status: 500 }
    );
  }
});
