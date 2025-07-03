import { validate } from "@/lib/validateSchema";
import blogSchema from "@/model/blogSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import {
  addBlogValidation,
  deleteBlogValidation,
  editBlogValidation,
} from "@/validation/blogValidation";
import { NextResponse } from "next/server";

// Add Blog
export const POST = asyncHandler(async (req) => {
  const body = await req.json();

  // Validate with common function
  const { error } = validate(addBlogValidation, body);
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  const result = await blogSchema.create(body);
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      message: "Blog added successfully!",
    });
  }
});

// Get blog
export const GET = asyncHandler(async (req) => {
  const result = await blogSchema.find();
  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Blog get successfully!",
    });
  }
});

// Put blog
export const PUT = asyncHandler(async (req) => {
  const body = await req.json();

  // Validate with common function
  const { error } = validate(editBlogValidation, body);
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  const result = await blogSchema.updateOne(
    { _id: body._id },
    { $set: { content: body.content } }
  );

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      message: "Blog updated successfully!",
    });
  }
});

// Delete blog
export const DELETE = asyncHandler(async (request) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  console.log(id);

  // Validate with common function
  const { error } = validate(deleteBlogValidation, { id: id });
  if (error) {
    return NextResponse.json({ error, isSuccess: false }, { status: 400 });
  }

  const findBlog = await blogSchema.findOne({ _id: id });

  if (!findBlog) {
    return NextResponse.json(
      { error, isSuccess: false, message: "Blog not found." },
      { status: 400 }
    );
  }

  const result = await blogSchema.deleteOne({ _id: id });

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      message: "Blog Deleted successfully!",
    });
  }
});