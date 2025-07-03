import { NextResponse } from "next/server";
import User from "@/model/Userschema";
import { validate } from "@/lib/validateSchema";
import { otpSchema } from "@/validation/authValidation";
import { asyncHandler } from "@/utils/asyncHandler";

// export async function POST(request) {
export const POST = asyncHandler(async (request) => {
  try {
    const body = await request.json();
    // Validate with common function
    const { value, error } = validate(otpSchema, body);
    if (error) {
      return NextResponse.json({ error, isSuccess: false }, { status: 400 });
    }
    const { email, otp } = value;

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "User not found", isSuccess: false },
        { status: 404 }
      );
    }

    if (!user.otp || !user.otpExpiresAt) {
      return NextResponse.json(
        { error: "OTP not requested or already used", isSuccess: false },
        { status: 400 }
      );
    }

    if (user.otpExpiresAt < new Date()) {
      return NextResponse.json(
        { error: "OTP has expired", isSuccess: false },
        { status: 400 }
      );
    }

    if (user.otp !== otp) {
      return NextResponse.json(
        { error: "Invalid OTP", isSuccess: false },
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
      { error: "Server error", isSuccess: false },
      { status: 500 }
    );
  }
});

// import { NextResponse } from "next/server";
// import connectToDB from "@/lib/dbConnect";
// import User from "@/model/Userschema";

// export async function POST(request) {
//   try {
//     const { email, otp } = await request.json();

//     if (!email || !otp) {
//       return NextResponse.json(
//         { error: "Email and OTP are required", isSuccess: false },
//         { status: 400 }
//       );
//     }

//     await connectToDB();
//     const user = await User.findOne({ email });

//     if (!user) {
//       return NextResponse.json(
//         { error: "User not found", isSuccess: false },
//         { status: 404 }
//       );
//     }

//     if (!user.otp || !user.otpExpiresAt) {
//       return NextResponse.json(
//         { error: "OTP not requested or already used", isSuccess: false },
//         { status: 400 }
//       );
//     }

//     // Check if OTP is expired
//     if (user.otpExpiresAt < new Date()) {
//       return NextResponse.json(
//         { error: "OTP has expired", isSuccess: false },
//         { status: 400 }
//       );
//     }

//     // Check if OTP matches
//     if (user.otp !== Number(otp)) {
//       return NextResponse.json(
//         { error: "Invalid OTP", isSuccess: false },
//         { status: 400 }
//       );
//     }

//     // OTP is valid: update user
//     user.isVerify = true;
//     user.otp = null;
//     user.otpExpiresAt = null;
//     await user.save();

//     return NextResponse.json(
//       { message: "OTP verified successfully", isSuccess: true },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Server error", isSuccess: false },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import connectToDB from "@/lib/dbConnect";
// import User from "@/model/Userschema";

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { email } = body;

//     // Validate required fields
//     if (!email) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     await connectToDB();

//     const existingUser = await User.findOne({ email: email });
//     if (existingUser) {
//       return NextResponse.json(
//         {
//           message: "Email verify successfully",
//         },
//         { status: 201 }
//       );
//     } else {
//       return NextResponse.json(
//         {
//           message: "Invalid Email address",
//         },
//         { status: 201 }
//       );
//     }
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json({ error: "Server error" }, { status: 400 });
//   }
// }
