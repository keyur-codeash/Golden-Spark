// /api/variants/route.js
import { validate } from "@/lib/validateSchema";
import Variant from "@/model/product_variants";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";
import {
  addVariantSchema,
  updateVariantSchema,
  getVariantSchema,
  deleteVariantSchema,
} from "@/validation/productVariantsValidation";
import sizeSchema from "@/model/sizeSchema";
import colorSchema from "@/model/colorSchema";

// Add Product variant
export const POST = asyncHandler(async (request) => {
  const body = await request.json();

  const { value, error } = validate(addVariantSchema, body);
  if (error) {
    return NextResponse.json(
      { message: error, isSuccess: false },
      { status: 400 }
    );
  }

  const existingVariant = await Variant.findOne({
    productId: body.productId,
    size: body.size,
    color: body.color,
  });
  if (existingVariant) {
    return NextResponse.json(
      { message: "Variant already exists", isSuccess: false },
      { status: 400 }
    );
  }
  const result = await Variant.create(body);
  return NextResponse.json({
    message: "Variants added successfully",
    data: result,
    isSuccess: true
  });
});

// Get all variants
export const GET = asyncHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const productId = searchParams.get("productId");

  // Validate productId
  if (!productId) {
    return NextResponse.json(
      { message: "productId is required", isSuccess: false },
      { status: 400 }
    );
  }

  const { error } = validate(getVariantSchema, { productId });
  if (error) {
    return NextResponse.json(
      { message: error.message, isSuccess: false },
      { status: 400 }
    );
  }

  // Find all variants
  const variants = await Variant.find({ productId });

  // Populate size & color details
  const details = await Promise.all(
    variants.map(async (item) => {
      const size = await sizeSchema.findById(item.size);
      const color = await colorSchema.findById(item.color);

      return {
        ...item.toObject(),
        size: size ? size.toObject() : null,
        color: color ? color.toObject() : null,
      };
    })
  );

  return NextResponse.json({
    message: "Variants fetched successfully",
    data: details,
    isSuccess: true,
  });
});

//  Update a variant
export const PUT = asyncHandler(async (request) => {
  const body = await request.json();

  const { value, error } = validate(updateVariantSchema, body);
  if (error) {
    return NextResponse.json({ message:error , isSuccess: false }, { status: 400 });
  }

  const { _id, ...updateData } = value;

  const updated = await Variant.findByIdAndUpdate(_id, updateData, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json(
      { message: "Variant not found", isSuccess: false },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Variant updated successfully",
    data: updated,
    isSuccess: true,
  });
});

// Delete a variant
export const DELETE = asyncHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const variantId = searchParams.get("variantId");
  const deleted = await Variant.findByIdAndDelete(variantId);

  if (!deleted) {
    return NextResponse.json(
      { message: "Variant not found", isSuccess: false },
      { status: 404 }
    );
  }

  return NextResponse.json({
    message: "Variant deleted successfully",
    isSuccess: true,
  });
});
