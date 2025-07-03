import { NextResponse } from "next/server";
import User from "@/model/Userschema";
import { generateToken } from "@/lib/auth";
import { asyncHandler } from "@/utils/asyncHandler";

export const POST = asyncHandler(async(request) => {
  try {
    const body = await request.json();
    const { email, loginType } = body;
    console.log(body);

    // Validation
    if (!email || !loginType) {
      return NextResponse.json(
        { error: "Email and loginType are required" },
        { status: 400 }
      );
    }

    // Only allow facebook and google login types
    if (!["facebook", "google"].includes(loginType)) {
      return NextResponse.json(
        { error: "Only facebook and google login types are supported" },
        { status: 400 }
      );
    }
    // Check if user exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // Generate token for successful login
      const token = generateToken(user);
      if (user.login_type != loginType) {
        const updatedUser = await User.findOneAndUpdate(
          { email: user.email }, // Filter (query) to find the document
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
          message:
            "Welcome back! You have successfully logged in to Golden spark",
          status: true,
          user: {
            email: user.email,
            loginType: loginType,
          },
          token,
        },
        { status: 201 }
      );
    } else {
      // Create new user for social login
      user = new User({
        email,
        login_type: loginType,
      });

      const userSave = await user.save();
      console.log("userSave", userSave);

      const token = generateToken(user);
      return NextResponse.json(
        {
          message:
            "Congratulations! You have successfully registered. Welcome to Golden spark",
          status: true,
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
        { error: "Email already exists with a different login method" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Server error", details: err.message },
      { status: 500 }
    );
  }
})

// import { NextResponse } from "next/server";
// import connectToDB from "@/lib/dbConnect";
// import User from "@/model/Userschema";
// import { generateToken } from "@/lib/auth";

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { email, userName, loginType, password } = body;

//     // Basic validation
//     if (!email) {
//       return NextResponse.json({ error: "Email is required" }, { status: 400 });
//     }

//     await connectToDB();

//     // Check if user exists with this email
//     let user = await User.findOne({ email });

//     if (user) {
//       // User exists - check if this login type is already registered
//       if (!user.login_type.includes(loginType)) {
//         // Add the new login type to the user's login_type array
//         user.login_type.push(loginType);
//         await user.save();
//       }

//       // For social login, no password check needed
//       if (loginType !== "email") {
//         const token = generateToken(user);
//         return NextResponse.json(
//           {
//             message: "Social login successful",
//             token,
//             user: {
//               id: user._id,
//               userName: user.userName,
//               email: user.email,
//               loginType: user.login_type,
//               isVerify: user.isVerify,
//             },
//           },
//           { status: 200 }
//         );
//       }

//       // For email login, verify password
//       if (loginType === "email") {
//         const isMatch = await bcrypt.compare(password, user.password);
//         if (!isMatch) {
//           return NextResponse.json(
//             { error: "Invalid email or password" },
//             { status: 401 }
//           );
//         }

//         const token = generateToken(user);
//         return NextResponse.json(
//           {
//             message: "Email login successful",
//             token,
//             user: {
//               id: user._id,
//               userName: user.userName,
//               email: user.email,
//               loginType: user.login_type,
//               isVerify: user.isVerify,
//             },
//           },
//           { status: 200 }
//         );
//       }
//     } else {
//       // Create new user - different handling based on login type
//       if (loginType === "email") {
//         // For email registration, password is required
//         if (!password) {
//           return NextResponse.json(
//             { error: "Password is required for email registration" },
//             { status: 400 }
//           );
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         user = new User({
//           userName,
//           email,
//           password: hashedPassword,
//           login_type: [loginType],
//           isVerify: false, // Email users need to verify
//         });
//       } else {
//         // For social login, no password needed
//         user = new User({
//           userName: userName || email.split("@")[0], // Default username if not provided
//           email,
//           login_type: [loginType],
//           isVerify: true, // Social logins are considered verified
//         });
//       }

//       await user.save();

//       const token = generateToken(user);
//       return NextResponse.json(
//         {
//           message: "Registration successful",
//           token,
//           user: {
//             id: user._id,
//             userName: user.userName,
//             email: user.email,
//             loginType: user.login_type,
//             isVerify: user.isVerify,
//           },
//         },
//         { status: 201 }
//       );
//     }
//   } catch (err) {
//     console.error(err);
//     if (err.code === 11000) {
//       // MongoDB duplicate key error
//       return NextResponse.json(
//         { error: "Email already exists with a different login method" },
//         { status: 409 }
//       );
//     }
//     return NextResponse.json(
//       { error: "Server error", details: err.message },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import connectToDB from "@/lib/dbConnect";
// import User from "@/model/Userschema";
// import { generateToken } from "@/lib/auth";

// export async function POST(request) {
//   try {
//     const body = await request.json();
//     const { email, name } = body;

//     // Basic validation
//     if (!email) {
//       return NextResponse.json(
//         { error: "Email, provider and providerId are required" },
//         { status: 400 }
//       );
//     }

//     await connectToDB();

//     // Check if user exists with this email
//     let user = await User.findOne({ email });

//     if (user) {
//       // User exists - check if this provider is already linked
//       if (!user.authProviders.includes(provider)) {
//         // Add the new provider to the user's authProviders
//         user.authProviders.push(provider);

//         // Update provider-specific fields if needed
//         if (provider === "facebook") {
//           user.facebookId = providerId;
//         } else if (provider === "google") {
//           user.googleId = providerId;
//         }

//         await user.save();
//       }
//     } else {
//       // Create new user
//       user = new User({
//         name: name || email.split("@")[0],
//         email,
//         authProviders: [provider],
//         isVerified: true,
//         ...(provider === "facebook" && { facebookId: providerId }),
//         ...(provider === "google" && { googleId: providerId }),
//         ...(image && { image }),
//       });

//       await user.save();
//     }

//     // Generate token
//     const token = generateToken(user);

//     return NextResponse.json(
//       {
//         message: "Login successful",
//         token,
//         user: {
//           id: user._id,
//           name: user.name,
//           email: user.email,
//           image: user.image,
//           authProviders: user.authProviders,
//         },
//       },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error(err);
//     return NextResponse.json(
//       { error: "Server error", details: err.message },
//       { status: 500 }
//     );
//   }
// }
