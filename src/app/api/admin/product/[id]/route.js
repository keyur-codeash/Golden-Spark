import { NextResponse } from "next/server";
import productSchema from "@/model/productSchema";
import { productValidationSchema } from "@/validation/productValidationSchema";
import { validate } from "@/lib/validateSchema";
import saveFile from "@/utils/savefile";
import genratePublicUrl from "@/utils/genratePublicUrl";
const SAVE_PRODUCT_PATH = "backend/product";
import { getBrandById } from "@/lib/getBrand";
import { asyncHandler } from "@/utils/asyncHandler";
import deleteFile from "@/utils/deleteFile";
import productVariantSchema from "@/model/product_variants";
import colorSchemaModel from "@/model/colorSchema";
import sizeSchemaModel from "@/model/sizeSchema";
import { userAuthentication } from "@/middlewares/auth";
import wishlistSchema from "@/model/wishlistSchema";

export const GET = asyncHandler(async (request, { params }) => {
  try {
    const decodedUser = await userAuthentication(request);
    const userId = decodedUser.id;

    const url = new URL(request.url);
    const sizeId = url.searchParams.get("size");
    const colorId = url.searchParams.get("color");

    // Get Product
    const product = await productSchema.findById(params.id);
    if (!product) {
      return NextResponse.json(
        { isSuccess: false, message: "Product not found" },
        { status: 404 }
      );
    }

    // Get Brand
    const brand = await getBrandById(product.brand);
    if (!brand) {
      return NextResponse.json(
        { isSuccess: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    // Get all Variants of Product
    const allVariants = await productVariantSchema.find({
      productId: product._id,
    });

    if (!allVariants || allVariants.length === 0) {
      return NextResponse.json(
        { isSuccess: false, message: "No variants found for this product" },
        { status: 404 }
      );
    }

    const isWishlist = await wishlistSchema.findOne({
      user: userId,
      product: product._id,
    });

    // Get unique sizeIds and colorIds
    const sizeIds = [...new Set(allVariants.map((v) => v.size?.toString()))];
    const colorIds = [...new Set(allVariants.map((v) => v.color?.toString()))];

    // Fetch size and color details
    const allSizes = await sizeSchemaModel.find({ _id: { $in: sizeIds } });
    const allColors = await colorSchemaModel.find({ _id: { $in: colorIds } });

    let selectedVariant = null;

    if (sizeId || colorId) {
      // User selected size and/or color
      const query = { productId: product._id };
      if (sizeId) query.size = sizeId;
      if (colorId) query.color = colorId;

      selectedVariant = await productVariantSchema.findOne(query);
      if (!selectedVariant) {
        return NextResponse.json(
          {
            isSuccess: false,
            message: "No variant found for selected size/color",
          },
          { status: 404 }
        );
      }
    } else {
      // Check all size-color combinations to get first matching variant
      outerLoop: for (let size of allSizes) {
        for (let color of allColors) {
          const variant = await productVariantSchema.findOne({
            productId: product._id,
            size: size._id,
            color: color._id,
          });
          if (variant) {
            selectedVariant = variant;
            break outerLoop;
          }
        }
      }

      // If still no variant, pick first available variant
      if (!selectedVariant) {
        selectedVariant = allVariants[0];
      }
    }

    // Get selected size and color details
    const selectedColor = selectedVariant?.color
      ? await colorSchemaModel.findById(selectedVariant.color)
      : null;

    const selectedSize = selectedVariant?.size
      ? await sizeSchemaModel.findById(selectedVariant.size)
      : null;

    // Build API response
    return NextResponse.json({
      isSuccess: true,
      data: {
        title: product.title,
        brand: brand.name,
        images: product.images?.map((img) =>
          genratePublicUrl(SAVE_PRODUCT_PATH, img)
        ),
        price: selectedVariant?.price ?? product.price,
        description: product.description,
        sku: product.sku,
        isWishlist: isWishlist ? true : false,
        order: product.order,
        selectedVariant: selectedVariant
          ? {
              id: selectedVariant._id,
              price: selectedVariant.price,
              stock: selectedVariant.stock,
              sku: selectedVariant.sku,
              color: selectedColor
                ? {
                    id: selectedColor._id,
                    name: selectedColor.name,
                    color: selectedColor.color,
                  }
                : null,
              size: selectedSize
                ? { id: selectedSize._id, name: selectedSize.size }
                : null,
            }
          : null,
        availableSizes: allSizes.map((s) => ({ id: s._id, name: s.size })),
        availableColors: allColors.map((c) => ({
          id: c._id,
          name: c.name,
          color: c.color,
        })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { isSuccess: false, message: error.message },
      { status: 500 }
    );
  }
});

export const PUT = asyncHandler(async (request, { params }) => {
  const productId = params.id;

  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }

  const formData = await request.formData();

  // Helper: always extract only filename
  const extractFileName = (value) => {
    if (!value) return "";
    return value.toString().split("/").pop();
  };

  try {
    // -------------------------------
    // 1. Parse images from formData
    // -------------------------------
    let claimedExistingImages = [];
    const newImageFiles = [];
    const imageEntries = formData.getAll("images");

    for (const entry of imageEntries) {
      if (entry instanceof File && entry.name && entry.size > 0) {
        // NEW IMAGE FILE
        newImageFiles.push(entry);
      } else if (typeof entry === "string") {
        // EXISTING IMAGE FROM FRONTEND (URL or filename)
        try {
          const parsed = JSON.parse(entry);
          if (Array.isArray(parsed)) {
            claimedExistingImages.push(
              ...parsed.map((img) => extractFileName(img))
            );
          } else {
            claimedExistingImages.push(extractFileName(parsed));
          }
        } catch {
          claimedExistingImages.push(extractFileName(entry));
        }
      }
    }

    claimedExistingImages = [...new Set(claimedExistingImages)];

    //  Find product in DB
    const product = await productSchema.findById(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    // DB stores only filenames
    const dbImageNames = product.images.map((img) => extractFileName(img));

    //  Match existing images    
    const verifiedExistingImages = claimedExistingImages.filter((name) =>
      dbImageNames.includes(name)
    );

    // Images to delete
    const imagesToDelete = dbImageNames.filter(
      (name) => !verifiedExistingImages.includes(name)
    );

    if (imagesToDelete.length) {
      try {
        await deleteFile(SAVE_PRODUCT_PATH, imagesToDelete);
      } catch (err) {
        console.error("Failed to delete images:", err);
      }
    }

    // Save new image files
    const newImageFileNames = [];
    const newImagePublicUrls = [];

    for (const file of newImageFiles) {
      const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
      newImageFileNames.push(fileName);
      newImagePublicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
    }

    // -------------------------------
    // 5. Final images for DB (filenames only)
    // -------------------------------
    const updatedImageNames = [
      ...verifiedExistingImages, // filenames
      ...newImageFileNames,      // filenames
    ];

    // -------------------------------
    // 6. Final response images (URLs)
    // -------------------------------
    const updatedImageUrls = updatedImageNames.map((name) =>
      genratePublicUrl(SAVE_PRODUCT_PATH, name)
    );

    // -------------------------------
    // 7. Validate data before saving
    // -------------------------------
    const updateData = {
      ...Object.fromEntries(formData.entries()),
      images: updatedImageNames, // only filenames stored
    };

    const { value, message: validationError } = validate(
      productValidationSchema,
      updateData
    );

    if (validationError) {
      return NextResponse.json({ message: validationError }, { status: 400 });
    }

    // Update in DB
    const updatedProduct = await productSchema.findByIdAndUpdate(
      productId,
      { ...value, images: updatedImageNames },
      { new: true }
    );

    return NextResponse.json({
      message: "Product updated successfully",
      data: {
        ...updatedProduct.toObject(),
        images: updatedImageUrls,
      },
    });
  } catch (error) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});

export const DELETE = asyncHandler(async (_, { params }) => {
  const productId = params.id;
  if (!productId) {
    return NextResponse.json(
      { message: "Product ID is required" },
      { status: 400 }
    );
  }
  try {
    const product = await productSchema.findByIdAndDelete(productId);
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }
    // Delete associated images from storage
    if (product.images && product.images.length > 0) {
      try {
        await deleteFile(SAVE_PRODUCT_PATH, product.images);
      } catch (deleteError) {
        console.error("Failed to delete product images:", deleteError);
      }
    }
    return NextResponse.json({
      message: "Product has been removed successfully.",
      isSuccess: true,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});
