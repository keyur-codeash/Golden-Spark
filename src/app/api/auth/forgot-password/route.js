import { NextResponse } from "next/server";
import User from "@/model/Userschema";
import bcrypt from "bcrypt";
import { validate } from "@/lib/validateSchema";
import { forgotPasswordSchema } from "@/validation/authValidation";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (request) => {
  try {
    const body = await request.json();
    // Validate body
    const { value, error } = validate(forgotPasswordSchema, body);
    if (error) {
      return NextResponse.json({ error, isSuccess: false }, { status: 400 });
    }

    const { email, newPassword } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found", isSuccess: false },
        { status: 404 }
      );
    }

    if (!user.isVerify) {
      return NextResponse.json(
        { error: "OTP not verified", isSuccess: false },
        { status: 403 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password and reset verify flag
    user.password = hashedPassword;
    user.isVerify = false;
    await user.save();

    return NextResponse.json(
      { message: "Password reset successful", isSuccess: true },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", isSuccess: false },
      { status: 500 }
    );
  }
});
