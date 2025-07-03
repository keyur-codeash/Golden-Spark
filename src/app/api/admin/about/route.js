import { validate } from "@/lib/validateSchema";
import aboutSchema from "@/model/aboutSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  addAboutValidation,
  deleteAboutValidation,
  editAboutValidation,
} from "@/validation/aboutvalidation";
import { NextResponse } from "next/server";

// Add about
export const POST = asyncHandler(async (req) => {
  const body = await req.json();

  // Validate with common function
  const { error } = validate(addAboutValidation, body);
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  const result = await aboutSchema.create(body);
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      message: "About added successfully!",
    });
  }
});

// Get about
export const GET = asyncHandler(async (req) => {
  const result = await aboutSchema.find();
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "About get successfully!",
    });
  }
});

// Put about
export const PUT = asyncHandler(async (req) => {
  const body = await req.json();

  // Validate with common function
  const { error } = validate(editAboutValidation, body);
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  const result = await aboutSchema.updateOne({ _id: body._id }, { $set: body });

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      message: "About updated successfully!",
    });
  }
});

// Delete about
export const DELETE = asyncHandler(async (request) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  console.log(id);

  // Validate with common function
  const { error } = validate(deleteAboutValidation, { id: id });
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  const findabout = await aboutSchema.findOne({ _id: id });

  if (!findabout) {
    return NextResponse.json(
      { error, isSuccess: false, message: "About not found." },
      { status: 400 }
    );
  }

  const result = await aboutSchema.deleteOne({ _id: id });

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      message: "About Deleted successfully!",
    });
  }
});
