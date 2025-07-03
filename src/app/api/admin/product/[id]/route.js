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
      // ✅ Check all size-color combinations to get first matching variant
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
                ? { id: selectedColor._id, name: selectedColor.color }
                : null,
              size: selectedSize
                ? { id: selectedSize._id, name: selectedSize.size }
                : null,
            }
          : null,
        availableSizes: allSizes.map((s) => ({ id: s._id, name: s.size })),
        availableColors: allColors.map((c) => ({ id: c._id, name: c.color })),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { isSuccess: false, message: error.message },
      { status: 500 }
    );
  }
});

// export const GET = asyncHandler(async (request, { params }) => {
//   try {
//     const url = new URL(request.url);
//     const sizeId = url.searchParams.get("size");
//     const colorId = url.searchParams.get("color");

//     // Get Product
//     const product = await productSchema.findById(params.id);
//     if (!product) {
//       return NextResponse.json(
//         { isSuccess: false, message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     // Get Brand
//     const brand = await getBrandById(product.brand);
//     if (!brand) {
//       return NextResponse.json(
//         { isSuccess: false, message: "Brand not found" },
//         { status: 404 }
//       );
//     }

//     // Get all Variants of Product
//     const allVariants = await productVariantSchema.find({
//       productId: product._id,
//     });

//     if (!allVariants || allVariants.length === 0) {
//       return NextResponse.json(
//         { isSuccess: false, message: "No variants available for this product" },
//         { status: 404 }
//       );
//     }

//     // Get unique sizeIds and colorIds
//     const sizeIds = [...new Set(allVariants.map((v) => v.size?.toString()))];
//     const colorIds = [...new Set(allVariants.map((v) => v.color?.toString()))];

//     // Fetch all available sizes and colors
//     const allSizes = await sizeSchemaModel.find({ _id: { $in: sizeIds } });
//     const allColors = await colorSchemaModel.find({ _id: { $in: colorIds } });

//     // Determine Selected Variant
//     let selectedVariant;

//     if (sizeId || colorId) {
//       const query = { productId: product._id };
//       if (sizeId) query.size = sizeId;
//       if (colorId) query.color = colorId;

//       selectedVariant = await productVariantSchema.findOne(query);

//       if (!selectedVariant) {
//         return NextResponse.json(
//           {
//             isSuccess: false,
//             message: "No variant found for selected size/color",
//           },
//           { status: 404 }
//         );
//       }
//     } else {
//       // Default → First variant
//       selectedVariant = allVariants[0];
//     }

//     // Get selected size and color details
//     const selectedColor = selectedVariant?.color
//       ? await colorSchemaModel.findById(selectedVariant.color)
//       : null;

//     const selectedSize = selectedVariant?.size
//       ? await sizeSchemaModel.findById(selectedVariant.size)
//       : null;

//     // Build Response
//     return NextResponse.json({
//       isSuccess: true,
//       data: {
//         title: product.title,
//         brand: brand.name,
//         images: product.images?.map((img) =>
//           genratePublicUrl(SAVE_PRODUCT_PATH, img)
//         ),
//         price: selectedVariant?.price ?? product.price,
//         description: product.description,
//         sku: product.sku,
//         order: product.order,
//         selectedVariant: selectedVariant
//           ? {
//               id: selectedVariant._id,
//               price: selectedVariant.price,
//               stock: selectedVariant.stock,
//               sku: selectedVariant.sku,
//               color: selectedColor
//                 ? { id: selectedColor._id, name: selectedColor.color }
//                 : null,
//               size: selectedSize
//                 ? { id: selectedSize._id, name: selectedSize.size }
//                 : null,
//             }
//           : null,
//         availableSizes: allSizes.map((s) => ({ id: s._id, name: s.size })),
//         availableColors: allColors.map((c) => ({ id: c._id, name: c.color })),
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { isSuccess: false, message: error.message },
//       { status: 500 }
//     );
//   }
// });

// export const GET = asyncHandler(async (request, { params }) => {
//   try {
//     const url = new URL(request.url);
//     const sizeId = url.searchParams.get("size");
//     const colorId = url.searchParams.get("color");

//     // Get Product
//     const product = await productSchema.findById(params.id);
//     if (!product) {
//       return NextResponse.json(
//         { isSuccess: false, message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     // Get Brand
//     const brand = await getBrandById(product.brand);
//     if (!brand) {
//       return NextResponse.json(
//         { isSuccess: false, message: "Brand not found" },
//         { status: 404 }
//       );
//     }

//     // Get All Variants of Product
//     const allVariants = await productVariantSchema.find({
//       productId: product._id,
//     });

//     // Get all unique sizeIds and colorIds from variants
//     const sizeIds = [...new Set(allVariants.map((v) => v.size?.toString()))];
//     const colorIds = [...new Set(allVariants.map((v) => v.color?.toString()))];

//     // Fetch all available sizes and colors details
//     const allSizes = await sizeSchemaModel.find({ _id: { $in: sizeIds } });
//     const allColors = await colorSchemaModel.find({ _id: { $in: colorIds } });

//     // Determine selected variant (size/color filter)
//     let selectedVariant;
//     if (sizeId || colorId) {
//       const query = { productId: product._id };
//       if (sizeId) query.size = sizeId;
//       if (colorId) query.color = colorId;
//       selectedVariant = await productVariantSchema.findOne(query);
//       if (!selectedVariant) {
//         return NextResponse.json(
//           {
//             isSuccess: false,
//             message: "No variant found for selected size/color",
//           },
//           { status: 404 }
//         );
//       }
//     } else {
//       selectedVariant = allVariants[0];
//     }

//     // Get selected color and size details
//     const selectedColor = selectedVariant
//       ? await colorSchemaModel.findById(selectedVariant.colorId)
//       : null;
//     const selectedSize = selectedVariant
//       ? await sizeSchemaModel.findById(selectedVariant.sizeId)
//       : null;

//     return NextResponse.json({
//       isSuccess: true,
//       data: {
//         title: product.title,
//         brand: brand.name,
//         images: product.images?.map((img) =>
//           genratePublicUrl(SAVE_PRODUCT_PATH, img)
//         ),
//         price: selectedVariant?.price ?? product.price,
//         description: product.description,
//         sku: product.sku,
//         order: product.order,
//         selectedVariant: selectedVariant
//           ? {
//               id: selectedVariant._id,
//               price: selectedVariant.price,
//               stock: selectedVariant.stock,
//               sku: selectedVariant.sku,
//               color: selectedColor
//                 ? { id: selectedColor._id, name: selectedColor.color }
//                 : null,
//               size: selectedSize
//                 ? { id: selectedSize._id, name: selectedSize.size }
//                 : null,
//             }
//           : null,
//         availableSizes: allSizes.map((s) => ({ id: s._id, name: s.size })),
//         availableColors: allColors.map((c) => ({ id: c._id, name: c.color })),
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { isSuccess: false, message: error.message },
//       { status: 500 }
//     );
//   }
// });

// export const GET = asyncHandler(async (request, { params }) => {
//   try {
//     const url = new URL(request.url);
//     const size = url.searchParams.get("size");
//     const color = url.searchParams.get("color");

//     // Get the product
//     const product = await productSchema.findById(params.id);
//     if (!product) {
//       return NextResponse.json(
//         { isSuccess: false, message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     // Get the brand
//     const brand = await getBrandById(product.brand);
//     if (!brand) {
//       return NextResponse.json(
//         { isSuccess: false, message: "Brand not found" },
//         { status: 404 }
//       );
//     }

//     // Build variant query if color or size is provided
//     let productVariant = null;

//     if (color || size) {
//       const variantQuery = { productId: product._id };
//       if (color) variantQuery.color = color;
//       if (size) variantQuery.size = size;

//       productVariant = await productVariantSchema.findOne(variantQuery);

//       if (!productVariant) {
//         return NextResponse.json(
//           {
//             isSuccess: false,
//             message: "Product variant not found for the specified size or color",
//           },
//           { status: 404 }
//         );
//       }
//     } else {
//       // If no size/color, get any default variant
//       productVariant = await productVariantSchema.findOne({
//         productId: product._id,
//       });
//     }

//     return NextResponse.json({
//       isSuccess: true,
//       data: {
//         title: product.title,
//         brand: brand.name,
//         images: product.images?.map((img) =>
//           genratePublicUrl(SAVE_PRODUCT_PATH, img)
//         ),
//         price: productVariant?.price ?? product.price,
//         description: product.description,
//         sku: product.sku,
//         order: product.order,
//         size: productVariant?.size ?? null,
//         color: productVariant?.color ?? null,
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { isSuccess: false, message: error.message },
//       { status: 500 }
//     );
//   }
// });

// export const GET = asyncHandler(async (_, { params }) => {
//   try {
//     const size = url.searchParams.get("size");
//     const color = url.searchParams.get("color");

//     const product = await productSchema.findById(params.id);
//     if (!product) throw new Error("Product not found");

//     const brand = await getBrandById(product.brand);

//     if (!brand) throw new Error("Brand not found");

//     if (color || size) {
//       const query = {};
//       if (color) query.color = color;
//       if (size) query.size = size;
//       const productVariant = await productVariantSchema.findOne({
//         productId: product._id,
//         ...query,
//       });
//       if (!productVariant) {
//         throw new Error("Product not found for the specified size or color");
//       }
//       return Response.json({
//         isSuccess: true,
//         data: {
//           title: product.title,
//           brand: brand.name,
//           images: product.images?.map((img) =>
//             genratePublicUrl(SAVE_PRODUCT_PATH, img)
//           ),
//           price: productVariant.price,
//           description: product.description,
//           sku: product.sku,
//           order: product.order,
//           size: productVariant.size,
//           color: productVariant.color,
//         },
//       });
//     }

//     // If no size or color is specified, return the product details without variants
//     const product_variant = await productVariantSchema.findOne({
//       productId: product._id,
//     });

//     console.log("product_variant", product_variant);

//     return Response.json({
//       isSuccess: true,
//       data: {
//         title: product.title,
//         brand: brand.name,
//         images: product.images?.map((img) =>
//           genratePublicUrl(SAVE_PRODUCT_PATH, img)
//         ),
//         price: product.price,
//         description: product.description,
//         sku: product.sku,
//         order: product.order,
//         size: product_variant.size,
//         color: product_variant.color,
//       },
//     });
//   } catch (error) {
//     return Response.json(
//       { isSuccess: false, message: error.message },
//       { status: 404 }
//     );
//   }
// });

// export const GET = asyncHandler(async (request, { params }) => {
//   try {
//     const url = new URL(request.url);
//     const sizeId = url.searchParams.get("size");
//     const colorId = url.searchParams.get("color");

//     console.log(
//       "sizeId:=========",
//       sizeId,
//       "colorId:=================",
//       colorId
//     );

//     // Get Product
//     const product = await productSchema.findById(params.id);
//     if (!product) {
//       return NextResponse.json(
//         { isSuccess: false, message: "Product not found" },
//         { status: 404 }
//       );
//     }

//     // Get Brand
//     const brand = await getBrandById(product.brand);
//     if (!brand) {
//       return NextResponse.json(
//         { isSuccess: false, message: "Brand not found" },
//         { status: 404 }
//       );
//     }

//     // Get All Variants for this product
//     const allVariants = await productVariantSchema.find({
//       productId: product._id,
//     });

//     // Fetch color and size details from their tables
//     const colors = await colorSchemaModel.findOne({ _id: colorId });
//     const sizes = await sizeSchemaModel.findOne({ _id: sizeId });

//     console.log("colors:=========", colors, "sizes:=================", sizes);

//     // Get selected variant (if colorId/sizeId given in query)
//     let selectedVariant = null;
//     if (colorId || sizeId) {
//       const query = { productId: product._id };
//       if (colorId) query.color = colorId;
//       if (sizeId) query.size = sizeId;

//       selectedVariant = await productVariantSchema.findOne(query);
//       console.log("selectedVariant:=========", selectedVariant, query);

//       if (!selectedVariant) {
//         return NextResponse.json(
//           {
//             isSuccess: false,
//             message: "No variant found for selected size or color.....",
//           },
//           { status: 404 }
//         );
//       }
//     } else {
//       selectedVariant = allVariants[0];
//     }

//     // Fetch selected color and size details
//     const selectedColor = selectedVariant
//       ? await colorSchemaModel.findById(selectedVariant.colorId)
//       : null;

//     const selectedSize = selectedVariant
//       ? await sizeSchemaModel.findById(selectedVariant.sizeId)
//       : null;

//     return NextResponse.json({
//       isSuccess: true,
//       data: {
//         title: product.title,
//         brand: brand.name,
//         images: product.images?.map((img) =>
//           genratePublicUrl(SAVE_PRODUCT_PATH, img)
//         ),
//         price: selectedVariant?.price ?? product.price,
//         description: product.description,
//         sku: product.sku,
//         order: product.order,
//         selectedVariant: selectedVariant
//           ? {
//               price: selectedVariant.price,
//               stock: selectedVariant.stock,
//               sku: selectedVariant.sku,
//               color: colors
//                 ? {
//                     id: colors._id,
//                     name: colors.color,
//                   }
//                 : null,
//               size: sizes
//                 ? {
//                     id: sizes._id,
//                     name: sizes.size,
//                   }
//                 : null,
//             }
//           : null,
//       },
//     });
//   } catch (error) {
//     return NextResponse.json(
//       { isSuccess: false, message: error.message },
//       { status: 500 }
//     );
//   }
// });

export const PUT = asyncHandler(async (request, { params }) => {
  const productId = params.id;
  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }

  const formData = await request.formData();

  try {
    // Parse existing images from form data
    let claimedExistingImages = [];
    const newImageFiles = [];

    // Process all image entries from form data
    const imageEntries = formData.getAll("images");
    for (const entry of imageEntries) {
      if (entry instanceof File && entry.name && entry.size > 0) {
        // This is a new image file
        newImageFiles.push(entry);
      } else if (typeof entry === "string") {
        // This is a claimed existing image reference
        try {
          const parsed = JSON.parse(entry);
          if (Array.isArray(parsed)) {
            claimedExistingImages.push(
              ...parsed.filter((img) => typeof img === "string")
            );
          } else if (typeof parsed === "string") {
            claimedExistingImages.push(parsed);
          }
        } catch {
          if (typeof entry === "string") {
            claimedExistingImages.push(entry);
          }
        }
      }
    }

    // Remove duplicates from claimed existing images
    claimedExistingImages = [...new Set(claimedExistingImages)];

    // Get current product data
    const product = await productSchema.findById(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Normalize database images (handle stringified arrays)
    const normalizeDbImages = (images) => {
      if (!images) return [];
      return images.flatMap((img) => {
        if (typeof img !== "string") return [];
        try {
          const parsed = JSON.parse(img);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [img];
        }
      });
    };

    const normalizedDbImages = normalizeDbImages(product.images);

    // Filter claimed existing images to only those that actually exist in DB
    const verifiedExistingImages = claimedExistingImages.filter((img) =>
      normalizedDbImages.includes(img)
    );

    // Identify images to delete (present in DB but not in verified updated list)
    const imagesToDelete = normalizedDbImages.filter(
      (dbImage) => !verifiedExistingImages.includes(dbImage)
    );

    // Delete old images from storage that are no longer needed
    if (imagesToDelete.length > 0) {
      try {
        await deleteFile(SAVE_PRODUCT_PATH, imagesToDelete);
      } catch (deleteError) {
        console.error("Failed to delete old images:", deleteError);
        // Continue even if deletion fails
      }
    }

    // Save new files to storage
    const newImageFileNames = [];
    const newImagePublicUrls = [];
    for (const file of newImageFiles) {
      try {
        const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
        newImageFileNames.push(fileName);
        newImagePublicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
      } catch (saveError) {
        console.error("Failed to save new image:", saveError);
        // Clean up any that were saved
        if (newImageFileNames.length > 0) {
          await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
        }
        return NextResponse.json(
          { error: "Failed to save product images" },
          { status: 500 }
        );
      }
    }

    // Combine verified existing images with new images
    const updatedImages = [...verifiedExistingImages, ...newImageFileNames];
    const updatedImageUrls = [
      ...verifiedExistingImages.map((img) =>
        genratePublicUrl(SAVE_PRODUCT_PATH, img)
      ),
      ...newImagePublicUrls,
    ];

    // Prepare update data
    const updateData = {
      ...Object.fromEntries(formData.entries()),
      images: updatedImages,
    };

    // Remove images field from form data to avoid duplicate in validation
    formData.delete("images");

    // Validate product data
    const { value, error: validationError } = validate(
      productValidationSchema,
      updateData
    );
    if (validationError) {
      // Clean up newly uploaded files if validation fails
      if (newImageFileNames.length > 0) {
        try {
          await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
        } catch (cleanupError) {
          console.error(
            "Failed to clean up files after validation error:",
            cleanupError
          );
        }
      }
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    // Update product in database
    const updatedProduct = await productSchema.findByIdAndUpdate(
      productId,
      { ...value, images: updatedImages },
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
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});

export const DELETE = asyncHandler(async (_, { params }) => {
  const productId = params.id;
  if (!productId) {
    return NextResponse.json(
      { error: "Product ID is required" },
      { status: 400 }
    );
  }
  try {
    const product = await productSchema.findByIdAndDelete(productId);
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    // Delete associated images from storage
    if (product.images && product.images.length > 0) {
      try {
        await deleteFile(SAVE_PRODUCT_PATH, product.images);
      } catch (deleteError) {
        console.error("Failed to delete product images:", deleteError);
        // Continue even if deletion fails - we don't want to block the delete operation
      }
    }
    return NextResponse.json({
      message: "Product deleted successfully",
      isSuccess: true,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
});

// export const PUT = asyncHandler(async (request, { params }) => {
//   const productId = params.id;
//   if (!productId) {
//     return NextResponse.json(
//       { error: "Product ID is required" },
//       { status: 400 }
//     );
//   }

//   const formData = await request.formData();

//   try {
//     // Parse existing images from form data
//     let existingImageNames = [];
//     const newImageFiles = [];

//     // Process all image entries from form data
//     const imageEntries = formData.getAll("images");
//     for (const entry of imageEntries) {
//       if (entry instanceof File && entry.name && entry.size > 0) {
//         // This is a new image file
//         newImageFiles.push(entry);
//       } else if (typeof entry === 'string') {
//         // This is an existing image reference
//         try {
//           const parsed = JSON.parse(entry);
//           if (Array.isArray(parsed)) {
//             existingImageNames.push(...parsed.filter(img => typeof img === 'string'));
//           } else if (typeof parsed === 'string') {
//             existingImageNames.push(parsed);
//           }
//         } catch {
//           if (typeof entry === 'string') {
//             existingImageNames.push(entry);
//           }
//         }
//       }
//     }

//     // Remove duplicates from existing images
//     existingImageNames = [...new Set(existingImageNames)];

//     // Helper to normalize database images (handle stringified arrays)
//     const normalizeDbImages = (images) => {
//       if (!images) return [];
//       return images.flatMap(img => {
//         if (typeof img !== 'string') return [];
//         try {
//           const parsed = JSON.parse(img);
//           return Array.isArray(parsed) ? parsed : [parsed];
//         } catch {
//           return [img];
//         }
//       });
//     };

//     // Get current product data
//     const product = await productSchema.findById(productId);
//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // Normalize both existing and DB images to same format
//     const normalizedDbImages = normalizeDbImages(product.images);

//     // Identify images to delete (present in DB but not in updated list)
//     const imagesToDelete = normalizedDbImages.filter(
//       dbImage => !existingImageNames.includes(dbImage)
//     );

//     // Delete old images from storage that are no longer needed
//     if (imagesToDelete.length > 0) {
//       try {
//         await deleteFile(SAVE_PRODUCT_PATH, imagesToDelete);
//       } catch (deleteError) {
//         console.error("Failed to delete old images:", deleteError);
//         // Continue even if deletion fails - we don't want to block the update
//       }
//     }

//     // Save new files to storage
//     const newImageFileNames = [];
//     const newImagePublicUrls = [];
//     for (const file of newImageFiles) {
//       try {
//         const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//         newImageFileNames.push(fileName);
//         newImagePublicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//       } catch (saveError) {
//         console.error("Failed to save new image:", saveError);
//         // If we fail to save a new image, clean up any that were saved
//         if (newImageFileNames.length > 0) {
//           await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
//         }
//         return NextResponse.json(
//           { error: "Failed to save product images" },
//           { status: 500 }
//         );
//       }
//     }

//     // Combine kept existing images with new images
//     const updatedImages = [...existingImageNames, ...newImageFileNames];
//     const updatedImageUrls = [
//       ...existingImageNames.map(img => genratePublicUrl(SAVE_PRODUCT_PATH, img)),
//       ...newImagePublicUrls,
//     ];

//     // Prepare update data
//     const updateData = {
//       ...Object.fromEntries(formData.entries()),
//       images: updatedImages,
//     };

//     // Remove images field from form data to avoid duplicate in validation
//     formData.delete("images");

//     // Validate product data
//     const { value, error: validationError } = validate(productValidationSchema, updateData);
//     if (validationError) {
//       // Clean up newly uploaded files if validation fails
//       if (newImageFileNames.length > 0) {
//         try {
//           await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
//         } catch (cleanupError) {
//           console.error("Failed to clean up files after validation error:", cleanupError);
//         }
//       }
//       return NextResponse.json({ error: validationError }, { status: 400 });
//     }

//     // Update product in database
//     const updatedProduct = await productSchema.findByIdAndUpdate(
//       productId,
//       { ...value, images: updatedImages },
//       { new: true }
//     );

//     return NextResponse.json({
//       message: "Product updated successfully",
//       data: {
//         ...updatedProduct.toObject(),
//         images: updatedImageUrls,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// });

// export const PUT = asyncHandler(async (request, { params }) => {
//   const productId = params.id;
//   if (!productId) {
//     return NextResponse.json(
//       { error: "Product ID is required" },

//       { status: 400 }
//     );
//   }

//   const formData = await request.formData();

//   try {
//     // Parse existing images from form data
//     let existingImageNames = [];

//     const newImageFiles = [];
//     Array.from(formData.getAll("images"))
//       .forEach((file) => {
//         if (file instanceof File && file.name && file.size > 0) {
//           newImageFiles.push(file);
//         } else if (typeof file === 'string') {
//           // Handle stringified array or plain string
//           try {
//             const parsed = JSON.parse(file);
//             existingImageNames = Array.isArray(parsed) ? parsed : [parsed];
//           } catch {
//             existingImageNames = [file];
//           }
//         }
//       });

//     // Normalize database images format (handle stringified arrays)
//     const normalizeDbImages = (images) => {
//       return images.flatMap(img => {
//         try {
//           const parsed = JSON.parse(img);
//           return Array.isArray(parsed) ? parsed : [parsed];
//         } catch {
//           return [img];
//         }
//       });
//     };

//     // Get current product data
//     const product = await productSchema.findById(productId);
//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // Normalize both existing and DB images to same format
//     const normalizedExisting = existingImageNames;
//     const normalizedDbImages = normalizeDbImages(product.images);

//     console.log("Existing images:", normalizedExisting);
//     console.log("DB images:", normalizedDbImages);

//     // Identify images to delete
//     const imagesToDelete = normalizedDbImages.filter(
//       (dbImage) => !normalizedExisting.includes(dbImage)
//     );

//     console.log("Images to delete:", imagesToDelete);

//     // Save new files to storage
//     const newImageFileNames = [];
//     const newImagePublicUrls = [];
//     for (const file of newImageFiles) {
//       const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//       newImageFileNames.push(fileName);
//       newImagePublicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//     }

//     // Combine kept existing images with new images
//     const updatedImages = [...normalizedExisting, ...newImageFileNames];
//     console.log("Updated images:", updatedImages);

//     const updatedImageUrls = [
//       ...normalizedExisting.map((img) => genratePublicUrl(SAVE_PRODUCT_PATH, img)),
//       ...newImagePublicUrls,
//     ];

//     // Validate other product data
//     const { value, error } = validate(productValidationSchema, {
//       ...Object.fromEntries(formData.entries()),
//       images: updatedImages,
//     });

//     if (error) {
//       // Clean up newly uploaded files if validation fails
//       if (newImageFileNames.length > 0) {
//         try {
//           await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
//         } catch (cleanupError) {
//           console.error("Failed to clean up files:", cleanupError);
//         }
//       }
//       return NextResponse.json({ error }, { status: 400 });
//     }

//     // Update product in database
//     const updatedProduct = await productSchema.findByIdAndUpdate(
//       productId,
//       { ...value, images: updatedImages },
//       { new: true }
//     );

//     return NextResponse.json({
//       message: "Product updated successfully",
//       data: {
//         ...updatedProduct.toObject(),
//         images: updatedImageUrls,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// });

// export const PUT = asyncHandler(async (request, { params }) => {
//   const productId = params.id;
//   if (!productId) {
//     return NextResponse.json(
//       { error: "Product ID is required" },
//       { status: 400 }
//     );
//   }

//   const formData = await request.formData();

//   try {
//     // Parse existing images from form data
//     let existingImageNames = [];

//     const newImageFiles = [];
//     Array.from(formData.getAll("images")).forEach((file) => {
//       if (file instanceof File && file.name && file.size > 0) {
//         newImageFiles.push(file);
//       } else if (typeof file === "string") {
//         // Handle both single string and array of strings
//         try {
//           existingImageNames = Array.isArray(JSON.parse(file))
//             ? JSON.parse(file)
//             : [file];
//         } catch {
//           existingImageNames = [file];
//         }
//       }
//     });

//     console.log(
//       "newImageFiles:===",
//       existingImageNames,
//       existingImageNames.length
//     );

//     const newImageFileNames = [];
//     const newImagePublicUrls = [];

//     // Save new files to storage
//     for (const file of newImageFiles) {
//       const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//       newImageFileNames.push(fileName);
//       newImagePublicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//     }

//     // Get current product data
//     const product = await productSchema.findById(productId);
//     if (!product) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     console.log(
//       "existingImageNames================",
//       existingImageNames,
//       "product.images",
//       product.images
//     );

//     const imagesToDelete = product.images.filter(
//       (dbImage) => !existingImageNames.includes(dbImage)
//     );

//     console.log("imagesToDelete================", imagesToDelete);

//     // Combine kept existing images with new images
//     const updatedImages = [...existingImageNames, ...newImageFileNames];
//     const updatedImageUrls = [
//       ...existingImageNames.map((img) =>
//         genratePublicUrl(SAVE_PRODUCT_PATH, img)
//       ),
//       ...newImagePublicUrls,
//     ];

//     // Validate other product data
//     const { value, error } = validate(productValidationSchema, {
//       ...Object.fromEntries(formData.entries()),
//       images: updatedImages,
//     });

//     if (error) {
//       console.log("newImageFileNames:===", newImageFileNames);

//       // Clean up any newly uploaded files if error occurs
//       if (imagesToDelete.length > 0) {
//         try {
//           await deleteFile(SAVE_PRODUCT_PATH, imagesToDelete);
//         } catch (cleanupError) {
//           console.error("Failed to clean up files:", cleanupError);
//         }
//       }

//       return NextResponse.json({ error }, { status: 400 });
//     }

//     // Update product in database
//     const updatedProduct = await productSchema.findByIdAndUpdate(
//       productId,
//       { ...value, images: updatedImages },
//       { new: true }
//     );

//     return NextResponse.json({
//       message: "Product updated successfully",
//       data: {
//         ...updatedProduct.toObject(),
//         images: updatedImageUrls,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// });

// export const PUT = asyncHandler(async (request, { params }) => {
//   const productId = params.id;
//   if (!productId) {
//     return NextResponse.json(
//       { error: "Product ID is required" },
//       { status: 400 }
//     );
//   }

//   const formData = await request.formData();

//   try {
//     // Parse existing images from form data
//     let existingImageNames = [];

//     const newImageFiles = [];
//     Array.from(formData.getAll("images"))
//       .map((file) => {
//         if (file instanceof File && file.name && file.size > 0) {
//           newImageFiles.push(file);
//         } else {
//           existingImageNames = file;
//         }
//       })
//       .filter(Boolean);
//       console.log("newImageFiles:===", existingImageNames , existingImageNames.length);

//     const newImageFileNames = [];
//     const newImagePublicUrls = [];

//     // Save new files to storage
//     for (const file of newImageFiles) {
//       const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//       newImageFileNames.push(fileName);
//       newImagePublicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//     }

//     // Get current product data
//     const product = await productSchema.findById(productId);
//     if (!product) {
//       // Clean up any newly uploaded files if product doesn't exist
//       // if (newImageFileNames.length > 0) {
//       //   await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
//       // }
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // Identify images to delete (in DB but not in existingImages array)
//     console.log(
//       "existingImageNames================",
//       existingImageNames,
//       "product.images",
//       product.images
//     );

//     const imagesToDelete = product.images.filter(
//       (dbImage) => !existingImageNames.includes(dbImage)
//     );

//     console.log("imagesToDelete================", imagesToDelete);

//     // Delete unused images from storage
//     // if (imagesToDelete.length > 0) {
//     //   await Promise.all(deleteFile(SAVE_PRODUCT_PATH, imagesToDelete));
//     // }

//     // Combine kept existing images with new images
//     const updatedImages = [...existingImageNames, ...newImageFileNames];
//     const updatedImageUrls = [
//       ...existingImageNames.map((img) =>
//         genratePublicUrl(SAVE_PRODUCT_PATH, img)
//       ),
//       ...newImagePublicUrls,
//     ];

//     // Validate other product data
//     const { value, error } = validate(productValidationSchema, {
//       ...Object.fromEntries(formData.entries()),
//       images: updatedImages,
//     });

//     if (error) {
//       // Clean up newly uploaded files if validation fails
//       console.log("newImageFileNames:===", newImageFileNames);

//       console.log(newImageFileNam);

//       // Clean up any newly uploaded files if error occurs
//       if (newImageFileNames.length > 0) {
//         try {
//           await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
//         } catch (cleanupError) {
//           console.error("Failed to clean up files:", cleanupError);
//         }
//       }

//       // if (newImageFileNames.length > 0) {
//       //   await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
//       // }

//       return NextResponse.json({ error }, { status: 400 });
//     }

//     // Update product in database
//     const updatedProduct = await productSchema.findByIdAndUpdate(
//       productId,
//       { ...value, images: updatedImages },
//       { new: true }
//     );

//     return NextResponse.json({
//       message: "Product updated successfully",
//       data: {
//         ...updatedProduct.toObject(),
//         images: updatedImageUrls,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal server error" },
//       { status: 500 }
//     );
//   }
// });

// export const PUT = asyncHandler(async (request, { params }) => {
//   const productId = params.id;
//   if (!productId) {
//     return NextResponse.json(
//       { error: "Product ID is required" },
//       { status: 400 }
//     );
//   }

//   const formData = await request.formData();
//   const formEntries = Object.fromEntries(formData.entries());

//   // Validation
//   const { value, error } = validate(productValidationSchema, formEntries);
//   if (error) {
//     return NextResponse.json({ error }, { status: 400 });
//   }

//   try {
//     // Parse existing images (array like ["product_1750337315047_M9Cq6.png"])
//     const existingImageNames = JSON.parse(
//       formData.get("existingImages") || "[]"
//     );

//     // Process new image files
//     const newImageFiles = formData
//       .getAll("images")
//       .filter((file) => file instanceof File && file.name && file.size > 0);
//     const newImageFileNames = [];
//     const newImagePublicUrls = [];

//     // Save new files to storage
//     for (const file of newImageFiles) {
//       const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//       newImageFileNames.push(fileName);
//       newImagePublicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//     }

//     // Get the original product from DB
//     const product = await productSchema.findById(productId);
//     if (!product) {
//       // Clean up newly uploaded files if product not found
//       if (newImageFileNames.length > 0) {
//         await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
//       }
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     // Determine which images to delete (present in DB but not in existingImageNames)
//     const imagesToDelete = product.images.filter(
//       (dbImage) => !existingImageNames.includes(dbImage)
//     );

//     // Delete unused images from storage
//     if (imagesToDelete.length > 0) {
//       await deleteFile(SAVE_PRODUCT_PATH, imagesToDelete);
//     }

//     // Combine kept existing images with new images
//     const finalImageList = [...existingImageNames, ...newImageFileNames];
//     const finalImageUrls = [
//       ...existingImageNames.map((img) =>
//         generatePublicUrl(SAVE_PRODUCT_PATH, img)
//       ),
//       ...newImagePublicUrls,
//     ];

//     // Update product data
//     const updateData = {
//       ...value,
//       images: finalImageList,
//     };

//     const updatedProduct = await productSchema.findByIdAndUpdate(
//       productId,
//       updateData,
//       { new: true }
//     );

//     return NextResponse.json({
//       message: "Product updated successfully",
//       data: {
//         ...updatedProduct.toObject(),
//         images: finalImageUrls,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// });

// export const PUT = asyncHandler(async (request, { params }) => {
//   const productId = params.id;
//   if (!productId) {
//     return NextResponse.json(
//       { error: "Product ID is required" },
//       { status: 400 }
//     );
//   }

//   const formData = await request.formData();
//   const formEntries = Object.fromEntries(formData.entries());

//   // Validation
//   const { value, error } = validate(productValidationSchema, formEntries);
//   if (error) {
//     return NextResponse.json({ error }, { status: 400 });
//   }

//   try {
//     // Parse existing images
//     const existingImageNames = JSON.parse(
//       formData.get("existingImages") || "[]"
//     );

//     // Process new image files
//     const newFiles = formData.getAll("images").filter((file) => file.name); // Only files with names
//     const newImageFileNames = [];
//     const publicUrls = [];

//     // Save new files
//     for (const file of newFiles) {
//       const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//       newImageFileNames.push(fileName);
//       publicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//     }

//     // Get the original product
//     const product = await productSchema.findById(productId);
//     if (!product) {
//       // Clean up newly uploaded files if product not found
//       if (newImageFileNames.length > 0) {
//         await deleteFile(SAVE_PRODUCT_PATH, newImageFileNames);
//       }
//       return NextResponse.json(
//         { error: "Product not found" },
//         { status: 404 }
//       );
//     }

//     // Determine images to delete (existing in DB but not in current list)
//     const imagesToDelete = product.images.filter(
//       (img) => !existingImageNames.includes(img)
//     );
//   console.log(imagesToDelete);

//     // Delete old files
//     if (imagesToDelete.length > 0) {
//       await deleteFile(SAVE_PRODUCT_PATH, imagesToDelete);
//     }

//     // Prepare updated data
//     const updateData = {
//       ...value,
//       images: [...existingImageNames, ...newImageFileNames],
//     };

//     console.log(updateData);

//     // Update product
//     // const updatedProduct = await productSchema.findByIdAndUpdate(
//     //   productId,
//     //   updateData,
//     //   { new: true }
//     // );

//     // Generate all image URLs for response
//     const updatedImageUrls = [
//       ...existingImageNames.map((img) =>
//         genratePublicUrl(SAVE_PRODUCT_PATH, img)
//       ),
//       ...publicUrls,
//     ];

//     return NextResponse.json({
//       message: "Product updated successfully",
//       data: {
//         ...updatedProduct.toObject(),
//         images: updatedImageUrls,
//       },
//     });
//   } catch (error) {
//     console.error("Error updating product:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// });

// export const PUT = asyncHandler(async (request, { params }) => {
//   const productId = params.id; // or get from query string
//   console.log(params.id);

//   const formData = await request.formData();
//   const formEntries = Object.fromEntries(formData.entries());

//   const { value, error } = validate(productValidationSchema, formEntries);
//   if (error) {
//     return NextResponse.json({ error }, { status: 400 });
//   }

//   // Parse old images (passed as JSON string from frontend)
//   const existingImageNames = JSON.parse(formData.get("existingImages") || "[]");

//   // Get uploaded new image files
//   const newFiles = formData.getAll("images") || [];
//   const newImageFileNames = [];
//   const publicUrls = [];

//   // Save new files
//   for (const file of newFiles) {
//     if (file.name) {
//       const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//       newImageFileNames.push(fileName);
//       publicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//     }
//     newImageFileNames.push(file);
//     publicUrls.push(genratePublicUrl(SAVE_PRODUCT_PATH, file));
//   }

//   // Get the original product from DB
//   const product = await productSchema.findById(productId);
//   if (!product) {
//     return NextResponse.json({ error: "Product not found" }, { status: 404 });
//   }

//   // Determine which images to delete
//   const imagesToDelete = product.images.filter(
//     (img) => !existingImageNames.includes(img)
//   );

//   await deleteFile(SAVE_PRODUCT_PATH, imagesToDelete);

//   // Final image list to store in DB
//   value.images = [...existingImageNames, ...newImageFileNames];

//   console.log(value);

//   // Update product
//   const updatedProduct = await productSchema.findByIdAndUpdate(
//     productId,
//     value,
//     {
//       new: true,
//     }
//   );

//   const updatedImageUrls = [
//     ...existingImageNames.map((img) =>
//       genratePublicUrl(SAVE_PRODUCT_PATH, img)
//     ),
//     ...publicUrls,
//   ];

//   return NextResponse.json({
//     message: "Product updated successfully",
//     data: {
//       ...updatedProduct.toObject(),
//       images: updatedImageUrls,
//     },
//   });
// });
