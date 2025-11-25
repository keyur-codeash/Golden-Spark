import { validate } from "@/lib/validateSchema";
import aboutSchema from "@/model/aboutSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import genratePublicUrl from "@/utils/genratePublicUrl";
import saveFile from "@/utils/savefile";
import {
  addAboutValidation,
  deleteAboutValidation,
  editAboutValidation,
} from "@/validation/aboutvalidation";
import { NextResponse } from "next/server";
const SAVE_PRODUCT_PATH = "backend/product";

// Add about
export const POST = asyncHandler(async (request) => {
  const formData = await request.formData();
  const formEntries = Object.fromEntries(formData.entries());
  const image = formData.get("image");

  let fileName = null;
  if (image && image.name) {
    fileName = await saveFile(SAVE_PRODUCT_PATH, image, "product");
    formEntries.image = fileName;
  }

  const { error } = validate(addAboutValidation, formEntries);
  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { status: 400 }
    );
  }

  const result = await aboutSchema.create(formEntries);
  return NextResponse.json({
    isSuccess: true,
    message: "About added successfully!",
  });
});

// Get about
export const GET = asyncHandler(async () => {
  const result = await aboutSchema.find();

  const data = result.map((item) => ({
    ...item.toObject(),
    image: genratePublicUrl(SAVE_PRODUCT_PATH, item.image),
  }));

  return NextResponse.json({
    isSuccess: true,
    data,
    message: "About fetched successfully!",
  });
});

export const PUT = asyncHandler(async (request) => {
  try {
    // Check if the content type is form-data
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        {
          isSuccess: false,
          message: "Invalid content type. Expected multipart/form-data",
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();

    // Extract all fields
    const heading = formData.get("heading");
    const sub_heading = formData.get("sub_heading");
    const content = formData.get("content");
    const _id = formData.get("_id");
    const image = formData.get("image");

    console.log("Received fields:", { heading, sub_heading, content, _id });

    // Create formEntries object
    const formEntries = {
      heading,
      sub_heading,
      content,
      _id,
    };

    // If new image provided, upload and replace
    if (image && typeof image !== "string" && image.name) {
      console.log("Processing image upload...");
      const fileName = await saveFile(SAVE_PRODUCT_PATH, image, "product");
      formEntries.image = fileName;
    }

    // Validate input
    const { error } = validate(editAboutValidation, formEntries);
    if (error) {
      return NextResponse.json(
        { message: error, isSuccess: false },
        { status: 400 }
      );
    }

    // Update DB record
    const result = await aboutSchema.updateOne(
      { _id: formEntries._id },
      { $set: formEntries }
    );

    if (result.modifiedCount > 0) {
      return NextResponse.json({
        isSuccess: true,
        message: "About updated successfully!",
      });
    } else {
      return NextResponse.json({
        isSuccess: false,
        message: "No changes made or About not found!",
      });
    }
  } catch (error) {
    console.error("FormData parsing error:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: `Failed to parse FormData: ${error.message}`,
      },
      { status: 400 }
    );
  }
});

// Delete about
export const DELETE = asyncHandler(async (request) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");
  // Validate with common function
  const { error } = validate(deleteAboutValidation, { id: id });
  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { isSuccess: 400 }
    );
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
})