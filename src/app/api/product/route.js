// app/api/upload/route.js
import { NextResponse } from "next/server";
import productSchema from "@/model/productSchema";
import genratePublicUrl from "@/utils/genratePublicUrl";
const SAVE_PRODUCT_PATH = "backend/product";
import { getBrandById } from "@/lib/getBrand";
import { asyncHandler } from "@/utils/asyncHandler";
import productVariantSchema from "@/model/product_variants";
import wishlistSchema from "@/model/wishlistSchema";
import { userAuthentication } from "@/middlewares/auth";

// Get products with filters and pagination
export const GET = asyncHandler(async (request) => {
  let userId = 0;
  try {
    const authHeader = request.headers.get("Authorization");

    if (authHeader) {
      const decodedUser = await userAuthentication(request);
      userId = decodedUser.id;
    }

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    const query = {
      isFeatured: url.searchParams.get("isFeatured"),
      isNewArrival: url.searchParams.get("isNewArrival"),
      category: url.searchParams.get("category"),
      brand: url.searchParams.get("brand"),
      color: url.searchParams.get("color"),
      size: url.searchParams.get("size"),
      inStock: url.searchParams.get("inStock"),
      outStock: url.searchParams.get("outStock"),
      minPrice: url.searchParams.get("minPrice"),
      maxPrice: url.searchParams.get("maxPrice"),
    };

    const filter = { isDeleted: 0 };
    const variantFilter = {};

    // Base product filters
    if (query.isFeatured)
      filter.isFeatured = query.isFeatured === "true" ? 1 : 0;
    if (query.isNewArrival) {
      filter.createdAt = {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      };
    }
    if (query.category) filter.category = query.category;
    if (query.brand) filter.brand = query.brand;

    // Variant-based filters
    if (query.color) variantFilter.color = { $in: query.color.split(",") };
    if (query.size) variantFilter.size = { $in: query.size.split(",") };
    if (query.minPrice || query.maxPrice) {
      variantFilter.price = {
        ...(query.minPrice && { $gte: Number(query.minPrice) }),
        ...(query.maxPrice && { $lte: Number(query.maxPrice) }),
      };
    }
    if (query.inStock) variantFilter.stock = { $gt: 0 };
    if (query.outStock) variantFilter.stock = { $lt: 1 };

    // Get filtered product IDs based on variants (if needed)
    if (Object.keys(variantFilter).length) {
      const variantProductIds = await productVariantSchema
        .find(variantFilter)
        .distinct("productId");

      if (!variantProductIds.length) {
        return NextResponse.json({
          isSuccess: false,
          message: "No Products Found",
        });
      }

      filter._id = { $in: variantProductIds };
    }

    const totalItems = await productSchema.countDocuments(filter);
    const products = await productSchema
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        const brandData = await getBrandById(product.brand);
        const firstVariant = await productVariantSchema
          .findOne({ productId: product._id })
          .sort({ price: 1 });

        let isWishlist = false;

        if (userId && userId != 0) {
          isWishlist = await wishlistSchema.findOne({
            user: userId,
            product: product._id,
          });
        }

        return {
          id: product._id,
          title: product.title,
          basePrice: product.price,
          price: firstVariant?.price ?? null,
          brand: brandData?.name ?? "Unknown",
          images: product.images.map((img) =>
            genratePublicUrl(SAVE_PRODUCT_PATH, img)
          ),
          description: product.description,
          sku: product.sku,
          isWishlist: isWishlist ? true : false,
          stock: product.stock,
          order: product.order,
          isFeatured: product.isFeatured,
          createdAt: product.createdAt,
        };
      })
    );

    // min and max variant price
    // const allProductIds = products.map((p) => p._id);

    const priceStats = await productVariantSchema.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      {
        $unwind: "$product",
      },
      {
        $match: {
          "product.isDeleted": 0,
        },
      },
      {
        $group: {
          _id: null,
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    const minPrice = priceStats[0]?.minPrice ?? 0;
    const maxPrice = priceStats[0]?.maxPrice ?? 0;

    const stock = await productVariantSchema.collection
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "product",
          },
        },
        {
          $unwind: "$product",
        },
        {
          $match: {
            "product.isDeleted": 0,
          },
        },
        {
          $group: {
            _id: "$productId",
            hasStock: {
              $max: {
                $cond: [{ $gt: ["$stock", 0] }, 1, 0],
              },
            },
          },
        },
        {
          $group: {
            _id: null,
            inStock: {
              $sum: { $cond: [{ $eq: ["$hasStock", 1] }, 1, 0] },
            },
            outStock: {
              $sum: { $cond: [{ $eq: ["$hasStock", 0] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            inStock: 1,
            outStock: 1,
          },
        },
      ])
      .toArray();

    return NextResponse.json({
      isSuccess: true,
      data: formattedProducts,
      minPrice,
      maxPrice,
      page,
      limit,
      stock: stock[0] || { inStock: 0, outStock: 0 },
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
});
