import { NextResponse } from "next/server";
import User from "@/model/Userschema";
import { generateToken } from "@/lib/auth";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (request) => {
  try {
    const body = await request.json();
    const { email, loginType } = body;

    if (!email || !loginType) {
      return NextResponse.json(
        { message: "Email and loginType are required" },
        { status: 400 }
      );
    }

    // Only allow facebook and google login types
    if (!["facebook", "google"].includes(loginType)) {
      return NextResponse.json(
        { message: "Only facebook and google login types are supported" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    if (user) {
      const token = generateToken(user);
      if (user.login_type != loginType) {
        const updatedUser = await User.findOneAndUpdate(
          { email: user.email },
          {
            $set: {
              login_type: loginType,
            },
          },
          {
            new: true,
            upsert: false,
            runValidators: true,
          }
        );
      }
      return NextResponse.json(
        {
          message: "Welcome back! You have successfully logged in.",
          isSuccess : true,
          user: {
            email: user.email,
            loginType: loginType,
          },
          token,
        },
        { status: 201 }
      );
    } else {
      user = new User({
        email,
        login_type: loginType,
      });

      const userSave = await user.save();

      const token = generateToken(user);
      return NextResponse.json(
        {
          message: "Congratulations! You have successfully registered.",
          isSuccess: true,
          user: {
            email: user.email,
          },
          token,
        },
        { status: 201 }
      );
    }
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      // MongoDB duplicate key error
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Email already exists with a different login method",
        },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { isSuccess: false, message: "Server error", details: err.message },
      { status: 500 }
    );
  }
});
