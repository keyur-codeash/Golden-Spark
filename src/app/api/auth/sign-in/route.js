import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import User from "@/model/Userschema";
import { generateToken } from "@/lib/auth";
import { signInSchema } from "@/validation/authValidation";
import { validate } from "@/lib/validateSchema";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async (request) => {
  const body = await request.json();
  const { value, error } = validate(signInSchema, body);
  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { status: 400 }
    );
  }
  const { email, password } = value;
  const user = await User.findOne({ email });

  if (!user || !user.password) {
    return NextResponse.json(
      { isSuccess: false, message: "Invalid email or password" },
      { status: 401 }
    );
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return NextResponse.json(
      { isSuccess: false, message: "Invalid email or password" },
      { status: 401 }
    );
  }

  const token = generateToken(user);

  return NextResponse.json(
    {
      message: "Login successful!",
      token,
      isSuccess: true,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
    { status: 200 }
  );
});
