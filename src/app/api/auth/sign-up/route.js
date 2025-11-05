// File: src/app/api/auth/sign-up/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/model/Userschema";
import { signUpSchema } from "@/validation/authValidation";
import { validate } from "@/lib/validateSchema";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (request) => {
  try {
    const body = await request.json();
    const { value, error } = validate(signUpSchema, body, { abortEarly: true });
    if (error) {
      return NextResponse.json({message: error, isSuccess: false }, { status: 400 });
    }

    const { userName, email, password } = value;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use", isSuccess: false },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        isSuccess: true,
        user: {
          id: newUser._id,
          name: newUser.userName,
          email: newUser.email,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { message: "Server error", isSuccess: false },
      { status: 500 }
    );
  }
});