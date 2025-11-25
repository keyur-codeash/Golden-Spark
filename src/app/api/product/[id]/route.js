import { NextResponse } from "next/server";
import productSchema from "@/model/productSchema";
import genratePublicUrl from "@/utils/genratePublicUrl";
const SAVE_PRODUCT_PATH = "backend/product";
import { getBrandById } from "@/lib/getBrand";
import { asyncHandler } from "@/utils/asyncHandler";
import productVariantSchema from "@/model/product_variants";
import colorSchemaModel from "@/model/colorSchema";
import sizeSchemaModel from "@/model/sizeSchema";
import { userAuthentication } from "@/middlewares/auth";
import wishlistSchema from "@/model/wishlistSchema";

export const GET = asyncHandler(async (request, { params }) => {
  try {
    let userId = 0;

    const authHeader = request.headers.get("Authorization");

    if (authHeader) {
      const decodedUser = await userAuthentication(request);
      userId = decodedUser.id;
    }

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

    let isWishlist = false;

    if (userId && userId != 0) {
      isWishlist = await wishlistSchema.findOne({
        user: userId,
        product: product._id,
      });
    }

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
        id: product.id,
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
              color: selectedColor._id || null,
              size: selectedSize._id || null,
            }
          : null,
        allVariants: allVariants.length
          ? allVariants.map((items) => {
              return {
                id: items._id,
                price: items.price,
                stock: items.stock,
                sku: items.sku,
                color: items.color || null,
                size: items.size || null,
              };
            })
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
