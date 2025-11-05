import { validate } from "@/lib/validateSchema";
import { userAuthentication } from "@/middlewares/auth";
import cardSchema from "@/model/cardSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  addCardValidation,
  deleteCardValidation,
  editCardValidation,
} from "@/validation/cardValidation";
import { NextResponse } from "next/server";

// Add Card
export const POST = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();
  body.user = userId;

  // Validate with common function
  const { error } = validate(addCardValidation, body);
  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { status: 400 }
    );
  }

  const isexist = await cardSchema.findOne({
    user: body.user,
    cardNumber: body.cardNumber,
  });

  if (isexist) {
    return NextResponse.json(
      { isSuccess: false, message: "Card already exist" },
      { status: 400 }
    );
  }

  const result = await cardSchema.create(body);
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Card added successfully!",
    });
  }
});

// Get Card
export const GET = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;

  const result = await cardSchema.find({ user: userId });
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Cards fetch successfully!",
    });
  }
});

// Put Card
export const PUT = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();
  body.user = userId;

  const { error } = validate(editCardValidation, body);
  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { status: 400 }
    );
  }

  const result = await cardSchema.updateOne({ _id: body._id }, { $set: body });

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Card updated successfully!",
    });
  }
});

// Delete blog
export const DELETE = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;

  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  // Validate with common function
  const { error } = validate(deleteCardValidation, { id: id });
  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { status: 400 }
    );
  }

  const findBlog = await cardSchema.findOne({ _id: id, user: userId });

  if (!findBlog) {
    return NextResponse.json(
      { error, isSuccess: false, message: "Card not found." },
      { status: 400 }
    );
  }

  const result = await cardSchema.deleteOne({ _id: id });

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      message: "Card removed successfully!",
    });
  }
});
