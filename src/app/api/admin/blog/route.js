import { validate } from "@/lib/validateSchema";
import blogSchema from "@/model/blogSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import deleteFile from "@/utils/deleteFile";
import genratePublicUrl from "@/utils/genratePublicUrl";
import saveFile from "@/utils/savefile";
import {
  addBlogValidation,
  deleteBlogValidation,
  editBlogValidation,
} from "@/validation/blogValidation";
import { NextResponse } from "next/server";
const SAVE_PRODUCT_PATH = "backend/blog";

// Add Blog
export const POST = asyncHandler(async (req) => {
  try {
    const formData = await req.formData();
    const image = formData.get("image");
    const heading = formData.get("heading");
    const content = formData.get("content");

    const body = { image, heading, content };

    const fileName = await saveFile(SAVE_PRODUCT_PATH, image, "contact");
    body.image = fileName;

    const { error } = validate(addBlogValidation, body);
    if (error) {
      return NextResponse.json(
        { isSuccess: false, message: error },
        { status: 400 }
      );
    }
    const result = await blogSchema.create(body);
    if (result) {
      return NextResponse.json({
        isSuccess: true,
        message: "Blog added successfully!",
      });
    }

    return NextResponse.json({
      isSuccess: false,
      message: "Failed to create blog",
    });
  } catch (err) {
    console.error("Error:", err);
    return NextResponse.json(
      { isSuccess: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
});

// Put blog
export const PUT = asyncHandler(async (req) => {
  try {
    const formData = await req.formData();

    const id = formData.get("_id");
    const heading = formData.get("heading");
    const content = formData.get("content");
    const image = formData.get("image");
    const updateData = { heading, content };

    if (image) {
      if (typeof image === "string") {
        updateData.image = image;
      } else {
        const findBlog = await blogSchema.findOne({ _id: id });
        console.log("findBlog==========", findBlog);

        if (findBlog) {
          await deleteFile(SAVE_PRODUCT_PATH, [findBlog.image]);
        }
        const fileName = await saveFile(SAVE_PRODUCT_PATH, image, "blog");
        updateData.image = fileName;
      }
    }

    const { error } = validate(editBlogValidation, { _id: id, ...updateData });
    if (error) {
      return NextResponse.json(
        { isSuccess: false, message: error },
        { status: 400 }
      );
    }

    const result = await blogSchema.updateOne(
      { _id: id },
      { $set: updateData }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        isSuccess: true,
        message: "Blog updated successfully!",
      });
    }

    return NextResponse.json({
      isSuccess: false,
      message: "No changes made or invalid ID",
    });
  } catch (err) {
    console.error("Error updating blog:", err);
    return NextResponse.json(
      { isSuccess: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
});

// Get blog
export const GET = asyncHandler(async () => {
  const result = await blogSchema.find();

  const details = result.map((item) => ({
    ...item.toObject(),
    image: genratePublicUrl(SAVE_PRODUCT_PATH, item.image),
  }));

  return NextResponse.json({
    isSuccess: true,
    data: details,
    message: "Blogs fetched successfully!",
  });
});

// Delete blog
export const DELETE = asyncHandler(async (request) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  // Validate with common function
  const { error } = validate(deleteBlogValidation, { id: id });
  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { isSuccess: 400 }
    );
  }

  const findBlog = await blogSchema.findOne({ _id: id });

  if (!findBlog) {
    return NextResponse.json(
      { error, isSuccess: false, message: "Blog not found." },
      { isSuccess: 400 }
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
