import { NextResponse } from "next/server";
import User from "@/model/Userschema";
import { sendEmail } from "@/lib/email";
import { verifyEmailSchema } from "@/validation/authValidation";
import { asyncHandler } from "@/utils/asyncHandler";

// export async function POST(request) {
export const POST = asyncHandler(async (request) => {
  try {
    const { email } = await request.json();

    // Validate with common function
    const { value, error } = validate(verifyEmailSchema, body);
    if (error) {
      return NextResponse.json({ error, isSuccess: false }, { status: 400 });
    } 

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate OTP and expiry time
    const otp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          otp: otp,
          otpExpiresAt: otpExpiresAt,
        },
      },
      { new: true } // returns the updated document
    );
    const sendOtp = await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <h2>Hello ${user.name || ""}</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP and link will expire in 15 minutes.</p>
      `,
    });

    if (sendOtp) {
      return NextResponse.json(
        { message: "OTP sent to your email", isSuccess: true },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        { message: "Something want wrong", isSuccess: false },
        { status: 200 }
      );
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error", isSuccess: false },
      { status: 500 }
    );
  }
});
