import { NextResponse } from "next/server";
import User from "@/model/Userschema";
import { sendEmail } from "@/lib/email";
import { verifyEmailSchema } from "@/validation/authValidation";
import { asyncHandler } from "@/utils/asyncHandler";
import { validate } from "@/lib/validateSchema";

export const POST = asyncHandler(async (request) => {
  try {
    const { email } = await request.json();

    // Validate with common function
    const { value, error } = validate(verifyEmailSchema, { email });
    if (error) {
      return NextResponse.json(
        { message: error, isSuccess: false },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Generate OTP and expiry time
    const otp = Math.floor(1000 + Math.random() * 9000);
    const otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await User.findOneAndUpdate(
      { email: email },
      {
        $set: {
          otp: otp,
          otpExpiresAt: otpExpiresAt,
        },
      },
      { new: true }
    );

    const sendOtp = await sendEmail({
      to: user.email,
      subject: "Reset Your Password - OTP Inside",
      html: `
<div style="max-width:650px;margin:0 auto;background:#ffffff;font-family:sans-serif;border-radius:12px"><div class="adM">
  </div><div style="text-align:center;color:white;background-color:#795741;padding:20px 0 10px 0;border-radius:12px 12px 0 0"><div class="adM">
    </div><h2 style="font-size:24px;margin:0">Reset Your Password</h2>
    <p style="font-size:15px;margin-top:8px">Secure your account with a one-time passcode</p>
  </div>
 <div style="background:#f9f4ee;border-radius:0 0 12px 12px">
  <div style="padding: 30px 30px 20px 30px;">
  <p style="font-size:16px;margin:0;color:#333333">
    Hello ${user.userName || "there"},
  </p>

  <p style="font-size:16px;color:#555555;margin-bottom:24px;line-height:25px">
    We received a request to reset your password. Please use the following One-Time Password (OTP) to proceed:
  </p>

  <div style="text-align:center;margin:24px 0">
    <div style="padding: 10px 30px;font-size:24px;font-weight:700;color:#795741;border:1 solid;border-radius:10px;letter-spacing:4px;border:1px dashed #795741">
      ${otp}
    </div>
  </div>

  <p style="font-size:14px;color:#666666;margin:0 0 14px">
    This code is valid for <strong>01 minutes</strong>. If it expires, you can always request a new one.
  </p>

  <p style="font-size:14px;color:#999999;margin: 0 0 20px;">
    If you did not request a password reset, please ignore this message.
  </p>

  <hr style="border:none;border-top:1px solid #dddddd;margin: 20px 0;">

 
  <p style="font-size: 12px; color: #aaaaaa; text-align: center; margin: 0">
    &copy; ${new Date().getFullYear()} ${
        process.env.SERVER_URL || "YourApp"
      } &middot; All rights reserved.
  </p>
      `,
    });

    // const sendOtp = await sendEmail({
    //   to: user.email,
    //   subject: "Reset your password",
    //   html: `
    //     <h4>Hello ${user.userName || ""}</h4>
    //     <p>Your OTP is: <strong>${otp}</strong></p>
    //     <p>This OTP and link will expire in 15 minutes.</p>
    //   `,
    // });

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
      { message: "Server error", isSuccess: false },
      { status: 500 }
    );
  }
});
