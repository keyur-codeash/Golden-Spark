import { getBrandById } from "@/lib/getBrand";
import { validate } from "@/lib/validateSchema";
import { userAuthentication } from "@/middlewares/auth";
import productSchema from "@/model/productSchema";
import wishlistSchema from "@/model/wishlistSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { signInSchema } from "@/validation/authValidation";
import { addWishlistSchema } from "@/validation/productWishlist";
import { NextResponse } from "next/server";
import productVariantSchema from "@/model/product_variants";
import genratePublicUrl from "@/utils/genratePublicUrl";

const SAVE_PRODUCT_PATH = process.env.SAVE_PRODUCT_PATH;

export const POST = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();
  const { productId } = body;

  const { value, error } = validate(addWishlistSchema, body);
  if (error) {
    return NextResponse.json(
      { isSuccess: false, error: error.details[0].message },
      { status: 400 }
    );
  }

  const existingProduct = await productSchema.findOne({
    _id: productId,
  });
  if (!existingProduct) {
    return NextResponse.json(
      { isSuccess: false, message: "Product not found." },
      { status: 404 }
    );
  }

  const wishlistExist = await wishlistSchema.findOne({
    user: userId,
    product: productId,
  });

  if (wishlistExist) {
    return NextResponse.json(
      { isSuccess: false, message: "Product already exists in wishlist." },
      { status: 400 }
    );
  }

  const result = await wishlistSchema.create({
    user: userId,
    product: productId,
  });

  return NextResponse.json({
    isSuccess: true,
    message: "Product added to wishlist successfully.",
    data: result,
  });
});

export const DELETE = asyncHandler(async (request) => {
  // ✅ Authenticate user
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;

  const url = new URL(request.url);
  const wishListId = url.searchParams.get("wishlistId");

  //  Check if item exists in wishlist
  const wishlistItem = await wishlistSchema.findOne({
    _id: wishListId,
  });

  if (!wishlistItem) {
    return NextResponse.json(
      { isSuccess: false, message: "Product not found in wishlist." },
      { status: 404 }
    );
  }

  // ✅ Delete item
  await wishlistSchema.deleteOne({ _id: wishlistItem._id });

  return NextResponse.json({
    isSuccess: true,
    message: "Product removed from wishlist successfully.",
  });
});

export const GET = asyncHandler(async (request) => {
  try {
    const decodedUser = await userAuthentication(request);
    const userId = decodedUser.id;

    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const limit = parseInt(url.searchParams.get("limit") || "10", 10);

    // ✅ Get all product IDs from user's wishlist
    const wishlistProductIds = await wishlistSchema
      .find({ user: userId })
      .distinct("product");

    if (!wishlistProductIds.length) {
      return NextResponse.json({
        isSuccess: true,
        data: [],
        message: "No products in wishlist",
      });
    }

    const totalItems = await productSchema.countDocuments({
      _id: { $in: wishlistProductIds },
      isDeleted: 0,
    });

    const products = await productSchema
      .find({
        _id: { $in: wishlistProductIds },
        isDeleted: 0,
      })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const formattedProducts = await Promise.all(
      products.map(async (product) => {
        const brandData = await getBrandById(product.brand);
        const firstVariant = await productVariantSchema
          .findOne({ productId: product._id })
          .sort({ price: 1 });

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
          stock: product.stock,
          order: product.order,
          isFeatured: product.isFeatured,
          createdAt: product.createdAt,
        };
      })
    );

    return NextResponse.json({
      isSuccess: true,
      data: formattedProducts,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      message: "Wishlist products fetched successfully",
    });
  } catch (error) {
    console.error("GET wishlist products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch wishlist products" },
      { status: 500 }
    );
  }
});

// export const GET = asyncHandler(async (request) => {
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);

//     const skip = (page - 1) * limit;

//     // Total count
//     const totalItems = await productSchema.countDocuments({ isDeleted: 0 });

//     // Fetch products
//     const products = await productSchema
//       .find({ isDeleted: 0 })
//       .sort({ createdAt: -1 })
//       .skip(skip)
//       .limit(limit);

//     // Format response
//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const brandData = await getBrandById(product.brand);
//         const firstVariant = await productVariantSchema
//           .findOne({ productId: product._id })
//           .sort({ price: 1 });

//         return {
//           id: product._id,
//           title: product.title,
//           basePrice: product.price,
//           price: firstVariant?.price ?? null,
//           brand: brandData?.name ?? "Unknown",
//           images: product.images.map((img) =>
//             genratePublicUrl(SAVE_PRODUCT_PATH, img)
//           ),
//           description: product.description,
//           sku: product.sku,
//           stock: product.stock,
//           order: product.order,
//           isFeatured: product.isFeatured,
//           createdAt: product.createdAt,
//         };
//       })
//     );

//     // Min and Max variant price for listed products
//     const allProductIds = products.map((p) => p._id);

//     const priceStats = await productVariantSchema.aggregate([
//       { $match: { productId: { $in: allProductIds } } },
//       {
//         $group: {
//           _id: null,
//           minPrice: { $min: "$price" },
//           maxPrice: { $max: "$price" },
//         },
//       },
//     ]);

//     const minPrice = priceStats[0]?.minPrice ?? 0;
//     const maxPrice = priceStats[0]?.maxPrice ?? 0;

//     return NextResponse.json({
//       isSuccess: true,
//       data: formattedProducts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalItems / limit),
//       totalItems,
//       message: "Products fetched successfully",
//     });
//   } catch (error) {
//     console.error("GET products error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to fetch products" },
//       { status: 500 }
//     );
//   }
// });

// export const GET = asyncHandler(async (request) => {
//   // ✅ Authenticate user
//   const decodedUser = await userAuthentication(request);
//   const userId = decodedUser.id;

//   // ✅ Get user's wishlist with product details (populate)
//   const wishlist = await wishlistSchema
//     .find({ user: userId })
//     .populate("product"); // Assuming you have a ref in your wishlistSchema for "product"

//   return NextResponse.json({
//     isSuccess: true,
//     message: "Wishlist fetched successfully.",
//     data: wishlist,
//   });
// });

// import { userAuthentication } from "@/middlewares/auth";
// import { asyncHandler } from "@/utils/asyncHandler";
// import { NextResponse } from "next/server";

// console.log("hellow");

// userAuthentication();

// export const POST = asyncHandler(async (req) => {
//   const user = req.body.id;
//   console.log(user);
//   return NextResponse.json({ msg: "hellow" });
// });

// export const GET = asyncHandler(async () => {
//   return NextResponse.json({ isSuccess: true, data: "brands" });
// });
