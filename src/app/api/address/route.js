import { validate } from "@/lib/validateSchema";
import { userAuthentication } from "@/middlewares/auth";
import addressSchema from "@/model/addressSchema";
import {
  addAddressValidation,
  editAddressValidation,
} from "@/validation/addressValidation";
import { NextResponse } from "next/server";
const { asyncHandler } = require("@/utils/asyncHandler");

// Add address
export const POST = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();
  body.user = userId;

  const { error } = validate(addAddressValidation, body);
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  if (body.isDefault) {
    const abcd = await addressSchema.updateMany(
      { userId: body.user },
      { $set: { isDefault: false } }
    );
  }

  const result = await addressSchema.create(body);
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Address added successdully!",
    });
  }
});

// Get address
export const GET = asyncHandler(async (request) => {
  await userAuthentication(request);
  const result = await addressSchema.find();
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Address get successdully!",
    });
  }
});

// Put address
export const PUT = asyncHandler(async (request) => {
  const body = await request.json();

  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  body.user = userId;
  const { error } = validate(editAddressValidation, body);
  if (error) {
    return NextResponse.json(
      { error: error.details[0].message, isSuccess: false },
      { status: 400 }
    );
  }
  if (body.isDefault) {
    await addressSchema.updateMany(
      { user: body.user },
      { $set: { isDefault: false } }
    );
  }

  const result = await addressSchema.findOneAndUpdate(
    { _id: body._id },
    {
      $set: body,
    },
    { new: true }
  );

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Address updated successfully!",
    });
  } else {
    return NextResponse.json(
      { isSuccess: false, message: "Address not found!" },
      { status: 404 }
    );
  }
});

export const DELETE = asyncHandler(async (request) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  // Validate id
  if (!id) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Address id is required",
      },
      { status: 400 }
    );
  }

  const deletedAddress = await addressSchema.findByIdAndDelete(id);
  if (!deletedAddress) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Address not found",
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    isSuccess: true,
    message: "Address deleted successfully!",
  });
});
