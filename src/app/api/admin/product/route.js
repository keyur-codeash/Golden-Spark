// app/api/upload/route.js
import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import productSchema from "@/model/productSchema";
import { productValidationSchema } from "@/validation/productValidationSchema";
import { validate } from "@/lib/validateSchema";
import saveFile from "@/utils/savefile";
import genratePublicUrl from "@/utils/genratePublicUrl";
const SAVE_PRODUCT_PATH = "backend/product";
import { getBrandById } from "@/lib/getBrand";
import { asyncHandler } from "@/utils/asyncHandler";
import productVariantSchema from "@/model/product_variants";
import mongoose from "mongoose";
import { log } from "console";
import wishlistSchema from "@/model/wishlistSchema";
import { userAuthentication } from "@/middlewares/auth";

// Add product
export const POST = asyncHandler(async (request) => {
  const formData = await request.formData();
  const formEntries = Object.fromEntries(formData.entries());

  const { value, error } = validate(productValidationSchema, formEntries);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }

  // Handle images...
  const files = formData.getAll("images");
  const savedFiles = [];
  const dbFileArray = [];

  for (const file of files) {
    const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
    dbFileArray.push(fileName);
    savedFiles.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
  }

  value.images = dbFileArray;
  const product = await productSchema.create(value);

  return NextResponse.json({
    message: "Product created successfully",
    data: { ...product.toObject(), images: savedFiles },
  });
});

// Get products with filters and pagination
export const GET = asyncHandler(async (request) => {
  try {
    const decodedUser = await userAuthentication(request);
    const userId = decodedUser.id;

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

        const isWishlist = await wishlistSchema.findOne({
          user: userId,
          product: product._id,
        });

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
    const allProductIds = products.map((p) => p._id);

    const priceStats = await productVariantSchema.aggregate([
      { $match: { productId: { $in: allProductIds } } },
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

    return NextResponse.json({
      isSuccess: true,
      data: formattedProducts,
      minPrice,
      maxPrice,
      page,
      limit,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.error("GET products error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
});

// export const GET = asyncHandler(async (request) => {
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page") || "1", 10);
//     const limit = parseInt(url.searchParams.get("limit") || "10", 10);

//     const filter = { isDeleted: 0 };
//     const variantFilter= {};

//     const query = {
//       isFeatured: url.searchParams.get("isFeatured"),
//       isNewArrival: url.searchParams.get("isNewArrival"),
//       category: url.searchParams.get("category"),
//       brand: url.searchParams.get("brand"),
//       color: url.searchParams.get("color"),
//       size: url.searchParams.get("size"),
//       inStock: url.searchParams.get("inStock"),
//       outStock: url.searchParams.get("outStock"),
//       minPrice: url.searchParams.get("minPrice"),
//       maxPrice: url.searchParams.get("maxPrice"),
//     };

//     // Product filters
//     if (query.isFeatured) filter.isFeatured = query.isFeatured === "true" ? 1 : 0;
//     if (query.isNewArrival) filter.createdAt = { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) };
//     if (query.category) filter.category = query.category;
//     if (query.brand) filter.brand = query.brand;

//     // Variant-based filters
//     if (query.color) variantFilter.color = { $in: query.color.split(",") };
//     if (query.size) variantFilter.size = { $in: query.size.split(",") };
//     if (query.minPrice || query.maxPrice) {
//       variantFilter.price = {
//         ...(query.minPrice && { $gte: Number(query.minPrice) }),
//         ...(query.maxPrice && { $lte: Number(query.maxPrice) }),
//       };
//     }
//     if (query.inStock) variantFilter.stock = { $gt: 0 };
//     if (query.outStock) variantFilter.stock = { $lt: 1 };

//     // Filter by variants if needed
//     if (Object.keys(variantFilter).length) {
//       const variantProductIds = await productVariantSchema.find(variantFilter).distinct("productId");
//       if (!variantProductIds.length) {
//         return NextResponse.json({ data: [], page, limit, totalPages: 0, totalItems: 0, message: "No products found" });
//       }
//       filter._id = { $in: variantProductIds };
//     }

//     const totalItems = await productSchema.countDocuments(filter);
//     const products = await productSchema
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const brandData = await getBrandById(product.brand);
//         const firstVariant = await productVariantSchema.findOne({ productId: product._id }).sort({ price: 1 });

//         return {
//           id: product._id,
//           title: product.title,
//           price: firstVariant?.price ?? null,
//           brand: brandData?.name ?? "Unknown",
//           images: product.images.map((img) => genratePublicUrl(SAVE_PRODUCT_PATH, img)),
//           description: product.description,
//           sku: product.sku,
//           stock: product.stock,
//           order: product.order,
//           isFeatured: product.isFeatured,
//           createdAt: product.createdAt,
//         };
//       })
//     );

//     return NextResponse.json({
//       data: formattedProducts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalItems / limit),
//       totalItems,
//       message: "Products fetched successfully",
//     });
//   } catch (error) {
//     console.error("GET products error:", error);
//     return NextResponse.json({ error: error.message || "Failed to fetch products" }, { status: 500 });
//   }
// });

// export const GET = asyncHandler(async (request) => {
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page")) || 1;
//     const limit = parseInt(url.searchParams.get("limit")) || 10;

//     // Extract query params
//     const isFeatured = url.searchParams.get("isFeatured");
//     const isNewArrival = url.searchParams.get("isNewArrival");
//     const category = url.searchParams.get("category");
//     const brand = url.searchParams.get("brand");
//     const color = url.searchParams.get("color"); // Color IDs as comma separated
//     const size = url.searchParams.get("size");
//     const inStock = url.searchParams.get("inStock");
//     const outStock = url.searchParams.get("outStock");
//     const minPrice = url.searchParams.get("minPrice");
//     const maxPrice = url.searchParams.get("maxPrice");

//     // Base product filter
//     const filter = { isDeleted: 0 };

//     // Featured Filter
//     if (isFeatured) {
//       filter.isFeatured = isFeatured === "true" ? 1 : 0;
//     }

//     // New Arrival Filter (Last 30 Days)
//     if (isNewArrival) {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
//       filter.createdAt = { $gte: oneMonthAgo };
//     }

//     // Category Filter
//     if (category) {
//       filter.category = category;
//     }

//     // Brand Filter
//     if (brand) {
//       filter.brand = brand;
//     }

//     // ✅ Color & Size Filter via Variants
//     if (color || size || inStock || outStock || minPrice || maxPrice) {
//       const colorArray = color ? color.split(",") : null;
//       const sizeArray = size ? size.split(",") : null;

//       const variantFilter = {};

//       if (colorArray) {
//         variantFilter.color = { $in: colorArray };
//       }

//       if (sizeArray) {
//         variantFilter.size = { $in: sizeArray };
//       }

//       if (maxPrice) {
//         variantFilter.price = { $lte: maxPrice, $gte: minPrice };
//       }

//       if (inStock) {
//         variantFilter.stock = { $gt: 0 };
//       }

//       if (outStock) {
//         variantFilter.stock = { $lt: 1 };
//       }

//       // Get matching product IDs from variants
//       const variantProductIds = await productVariantSchema
//         .find(variantFilter)
//         .distinct("productId");
//       if (!variantProductIds.length) {
//         return NextResponse.json({
//           data: [],
//           page,
//           limit,
//           totalPages: 0,
//           totalItems: 0,
//           message: "No products found for selected color and size filters",
//         });
//       }
//       filter._id = { $in: variantProductIds };
//     }

//     // Total count for pagination
//     const totalItems = await productSchema.countDocuments(filter);

//     // Fetch products
//     const products = await productSchema
//       .find(filter)
//       .sort({ createdAt: -1 }) // Newest first
//       .skip((page - 1) * limit)
//       .limit(limit);

//     // Format product data

//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const brandData = await getBrandById(product.brand);

//         // ✅ Get first variation for this product
//         const firstVariant = await productVariantSchema
//           .findOne({ productId: product._id })
//           .sort({ price: 1 });

//         return {
//           id: product._id,
//           title: product.title,
//           basePrice: product.price, // Product base price (if exists)
//           price: firstVariant ? firstVariant.price : null,
//           brand: brandData?.name,
//           images: product.images.map((img) => {
//             return genratePublicUrl(SAVE_PRODUCT_PATH, img);
//           }),
//           description: product.description,
//           sku: product.sku,
//           stock: product.stock,
//           order: product.order,
//           isFeatured: product.isFeatured,
//           createdAt: product.createdAt,
//         };
//       })
//     );

//     // const formattedProducts = await Promise.all(
//     //   products.map(async (product) => {
//     //     const brandData = await getBrandById(product.brand);

//     //     return {
//     //       id: product._id,
//     //       title: product.title,
//     //       price: product.price,
//     //       brand: brandData?.name || "Unknown",
//     //       images: product.images,
//     //       description: product.description,
//     //       sku: product.sku,
//     //       stock: product.stock,
//     //       order: product.order,
//     //       isFeatured: product.isFeatured,
//     //       createdAt: product.createdAt,
//     //     };
//     //   })
//     // );

//     return NextResponse.json({
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
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page")) || 1;
//     const limit = parseInt(url.searchParams.get("limit")) || 10;
//     const searchParams = request.nextUrl.searchParams;
//     const allParams = Object.fromEntries(searchParams.entries());

//     const isFeatured = url.searchParams.get("isFeatured");
//     const isNewArrival = url.searchParams.get("isNewArrival");
//     const category = url.searchParams.get("category");
//     const brand = url.searchParams.get("brand");
//     const color = url.searchParams.get("color");
//     const size = url.searchParams.get("size");
//     console.log("color==========-====",color);
//     const filter = { isDeleted: 0 }; // Fix: should be `deleted`, not `isDeleted`

//     if (isFeatured) {
//       filter.isFeatured = isFeatured === "true" ? 1 : 0;
//     }

//     if (isNewArrival) {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
//       filter.createdAt = { $gte: oneMonthAgo };
//     }

//     if (category) {
//       filter.category = category;
//     }

//     if (brand) {
//       filter.brand = brand;
//     }

//     // ✅ Color-wise filter based on variants
//     if (color) {
//       const colorArray = color.split(","); // Allow multiple colors
//       log("colorArray", colorArray);
//       const variantProductIds = await productVariantSchema
//         .find({
//           color: { $in: colorArray },
//         })
//         .distinct("productId");
//       console.log("variantProductIds", variantProductIds);

//       if (!variantProductIds.length) {
//         return NextResponse.json({
//           data: [],
//           page,
//           limit,
//           totalPages: 0,
//           totalItems: 0,
//           message: "No products found for selected color(s)",
//         });
//       }

//       filter._id = { $in: variantProductIds };
//     }

//     if (size) {
//       const sizeArray = size.split(","); // Allow multiple colors
//       const variantProductIds = await productVariantSchema
//         .find({
//           size: { $in: sizeArray },
//         })
//         .distinct("productId");
//       console.log("variantProductIds", variantProductIds);

//       if (!variantProductIds.length) {
//         return NextResponse.json({
//           data: [],
//           page,
//           limit,
//           totalPages: 0,
//           totalItems: 0,
//           message: "No products found for selected size(s)",
//         });
//       }

//       filter._id = { $in: variantProductIds };
//     }

//     console.log(filter);

//     const totalItems = await productSchema.countDocuments(filter);

//     const products = await productSchema
//       .find(filter)
//       .sort({ createdAt: -1 })
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const brandData = await getBrandById(product.brand);

//         return {
//           title: product.title,
//           price: product.price,
//           brand: brandData?.name || "Unknown",
//           images: product.images,
//           description: product.description,
//           sku: product.sku,
//           stock: product.stock,
//           order: product.order,
//           isFeatured: product.isFeatured,
//           createdAt: product.createdAt,
//         };
//       })
//     );

//     return NextResponse.json({
//       data: formattedProducts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalItems / limit),
//       totalItems,
//       message: "Product fetched successfully",
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
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page")) || 1;
//     const limit = parseInt(url.searchParams.get("limit")) || 10;
//     const searchParams = request.nextUrl.searchParams;
//     const allParams = Object.fromEntries(searchParams.entries());

//     // Extract filter parameters
//     const isFeatured = url.searchParams.get("isFeatured");
//     const isNewArrival = url.searchParams.get("isNewArrival");
//     const category = url.searchParams.get("category");
//     const brand = url.searchParams.get("brand");
//     const color = url.searchParams.get("color");

//     // Build the filter object
//     const filter = { isDeleted: 0 };

//     // Add featured filter if specified
//     if (isFeatured) {
//       filter.isFeatured = isFeatured === "true" ? 1 : 0;
//     }

//     // Add new arrival filter (products created in the last 30 days)
//     if (isNewArrival) {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setDate(oneMonthAgo.getDate() - 30);
//       filter.createdAt = { $gte: oneMonthAgo };
//     }

//     // Add category filter if specified
//     if (category) {
//       filter.category = category;
//     }

//     // Add brand filter if specified
//     if (brand) {
//       filter.brand = brand;
//     }

//     // Add color filter based on variants
//     if (color) {
//       const variantProductIds = await productVariantSchema.find({
//         productId: new mongoose.Types.ObjectId("6853a9a15610aeb094e02046"),
//         color: "685297cbe8cfe630bf6c3d15",
//       });
//       console.log(
//         "variantProductIds.length===========",
//         variantProductIds.length
//       );
//       log;
//       if (!variantProductIds.length) {
//         return NextResponse.json({
//           data: [],
//           page,
//           limit,
//           totalPages: 0,
//           totalItems: 0,
//           message: "No products found for this color",
//         });
//       }

//       filter._id = { $in: variantProductIds };
//     }

//     // console.log("Filter criteria:", filter);

//     const totalItems = await productSchema.countDocuments(filter);
//     console.log("Total items matching filter:", totalItems);

//     const products = await productSchema
//       .find(filter)
//       .sort({ createdAt: -1 }) // Newest first
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const brandData = await getBrandById(product.brand);
//         console.log(product);

//         return {
//           title: product.title,
//           price: product.price,
//           brand: brandData?.name || "Unknown",
//           images: product.images,
//           description: product.description,
//           sku: product.sku,
//           stock: product.stock,
//           order: product.order,
//           isFeatured: product.isFeatured,
//           createdAt: product.createdAt,
//         };
//       })
//     );

//     return NextResponse.json({
//       data: formattedProducts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalItems / limit),
//       totalItems,
//       message: "Product fetched successfully",
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
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page")) || 1;
//     const limit = parseInt(url.searchParams.get("limit")) || 10;
//     const searchParams = request.nextUrl.searchParams;
//     const allParams = Object.fromEntries(searchParams.entries());

//     // Extract filter parameters
//     const isFeatured = url.searchParams.get("isFeatured");
//     const isNewArrival = url.searchParams.get("isNewArrival");
//     const category = url.searchParams.get("category");
//     const brand = url.searchParams.get("brand");

//     // Build the filter object
//     const filter = { isDeleted: 0 };

//     // Add featured filter if specified
//     if (isFeatured) {
//       filter.isFeatured = isFeatured === "true" ? 1 : 0;
//     }

//     if (isNewArrival) {
//       const oneMonthAgo = new Date();
//       oneMonthAgo.setDate(oneMonthAgo.getDate() - 30); // Changed from 7 to 30 days
//       filter.createdAt = { $gte: oneMonthAgo };
//     }

//     // Add category filter if specified
//     if (category) {
//       filter.category = category;
//     }

//     // Add brand filter if specified
//     if (brand) {
//       filter.brand = brand;
//     }

//     console.log("Filter criteria:", filter);
//     const totalItems = await productSchema.countDocuments(filter);
//     console.log("Total items matching filter:", filter);

//     const products = await productSchema
//       .find(filter)
//       .sort({ createdAt: -1 }) // Sort by newest first by default
//       .skip((page - 1) * limit)
//       .limit(limit);

//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const brandData = await getBrandById(product.brand);
//         return {
//           title: product.title,
//           price: product.price,
//           brand: brandData?.name || "Unknown",
//           images: product.images,
//           description: product.description,
//           sku: product.sku,
//           stock: product.stock,
//           order: product.order,
//           isFeatured: product.isFeatured,
//           createdAt: product.createdAt,
//         };
//       })
//     );

//     return NextResponse.json({
//       data: formattedProducts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalItems / limit),
//       totalItems,
//       message: "Product fetched successfully",
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
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page")) || 1;
//     const limit = parseInt(url.searchParams.get("limit")) || 10;
//     const searchParams = request.nextUrl.searchParams;
//     const allParams = Object.fromEntries(searchParams.entries());
//     console.log("allParams============", allParams);

//     const totalItems = await productSchema.countDocuments({ isDeleted: 0 });
//     const products = await productSchema
//       .find({ isDeleted: 0 })
//       .skip((page - 1) * limit)
//       .limit(limit);
//     // console.log("products", products);

//     const formattedProducts = await Promise.all(
//       products.map(async (product) => {
//         const brandData = await getBrandById(product.brand);
//         return {
//           title: product.title,
//           price: product.price,
//           brand: brandData?.name || "Unknown",
//           images: product.images,
//           description: product.description,
//           sku: product.sku,
//           stock: product.stock,
//           order: product.order,
//         };
//       })
//     );

//     return NextResponse.json({
//       data: formattedProducts,
//       page,
//       limit,
//       totalPages: Math.ceil(totalItems / limit),
//       totalItems,
//       message: "Product fetched successfully",
//     });
//   } catch (error) {
//     console.error("GET products error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to fetch products" },
//       { status: 500 }
//     );
//   }
// });

// export const POST = withDb(async (request) => {
//   try {
//     const formData = await request.formData();
//     const formEntries = Object.fromEntries(formData.entries());

//     let variants = [];
//     if (formEntries.variants) {
//       try {
//         variants = JSON.parse(formEntries.variants); // array
//       } catch (err) {
//         return NextResponse.json(
//           { error: "Invalid variants format (must be JSON)" },
//           { status: 400 }
//         );
//       }
//     }

//     const { value, error } = validate(productValidationSchema, formEntries);
//     if (error) {
//       return NextResponse.json({ error, isSuccess: false }, { status: 400 });
//     }

//     const files = formData.getAll("images");
//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
//     }

//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     await fs.mkdir(uploadDir, { recursive: true });

//     const savedFiles = [];
//     const dbFileArray = [];

//     for (const file of files) {
//       if (!ALLOWED_MIME_TYPES.includes(file.type)) {
//         return NextResponse.json(
//           { error: `File type ${file.type} not allowed` },
//           { status: 400 }
//         );
//       }

//       if (file.size > MAX_FILE_SIZE) {
//         return NextResponse.json(
//           {
//             error: `File ${file.name} exceeds ${
//               MAX_FILE_SIZE / 1024 / 1024
//             }MB limit`,
//           },
//           { status: 400 }
//         );
//       }

//       try {
//         const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//         dbFileArray.push(fileName);
//         savedFiles.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//       } catch (fileError) {
//         console.error(`Error processing file ${file.name}:`, fileError);
//         continue;
//       }
//     }

//     if (savedFiles.length === 0) {
//       return NextResponse.json(
//         { error: "No files were successfully uploaded" },
//         { status: 400 }
//       );
//     }

//     // 👉 Save product first
//     value.images = dbFileArray;
//     const product = await Product.create(value);

//     // 👉 Save each variant with productId reference
//     if (variants.length > 0) {
//       const variantDocs = variants.map((v) => ({
//         ...v,
//         productId: product._id,
//       }));
//       await Variant.insertMany(variantDocs);
//     }

//     return NextResponse.json({
//       message: "Product and variants added successfully",
//       data: {
//         product: { ...product.toObject(), images: savedFiles },
//         variants,
//       },
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to upload files" },
//       { status: 500 }
//     );
//   }
// });

// export const GET = withDb(async (request) => {
//   try {
//     const url = new URL(request.url);
//     const page = parseInt(url.searchParams.get("page")) || 1;
//     const limit = parseInt(url.searchParams.get("limit")) || 10;

//     console.log(page, limit);

//     // const response = await productSchema.find({ deleted: 0 });
//     const totalItems = await productSchema.countDocuments();
//     console.log("total items" , totalItems);

//     const response = await productSchema
//       .find({ deleted: 0 })
//       .skip((page - 1) * limit)
//       .limit(limit)
//       .toArray();

//     console.log("response", response);

//     if (response?.length) {
//       const formattedProducts = await Promise.all(
//         response.map(async (product) => {
//           const brandData = await getBrandById(product.brand);
//           return {
//             title: product.title,
//             price: product.price,
//             brand: brandData?.name || "Unknown",
//             images: product.images,
//             description: product.description,
//             sku: product.sku,
//             stock: product.stock,
//             order: product.order,
//           };
//         })
//       );

//       return NextResponse.json({
//         data: formattedProducts,
//         page: page,
//         limit: limit,
//         totalPages: Math.ceil(totalItems / limitNumber),
//         totalItems,
//         message: "Product get successfully",
//       });
//     }
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to upload files" },
//       { status: 200 }
//     );
//   }
// });

// add product

// export const POST = withDb(async (request) => {
//   try {
//     // Get form data
//     const formData = await request.formData();
//     const formEntries = Object.fromEntries(formData.entries());
//     const { value, error } = validate(productValidationSchema, formEntries);

//     if (error) {
//       return NextResponse.json({ error, isSuccess: false }, { status: 400 });
//     }

//     const files = formData.getAll("images");

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
//     }

//     // Create upload directory if it doesn't exist
//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     await fs.mkdir(uploadDir, { recursive: true });

//     // Process files sequentially to reduce memory pressure
//     const savedFiles = [];
//     const dbFileArray = [];

//     for (const file of files) {
//       try {
//         // Validate file type
//         if (!ALLOWED_MIME_TYPES.includes(file.type)) {
//           return NextResponse.json(
//             { error: `File type ${file.type} not allowed` },
//             { status: 400 }
//           );
//         }

//         // Validate file size
//         if (file.size > MAX_FILE_SIZE) {
//           return NextResponse.json(
//             {
//               error: `File ${file.name} exceeds ${
//                 MAX_FILE_SIZE / 1024 / 1024
//               }MB limit`,
//             },
//             { status: 400 }
//           );
//         }

//         const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//         // await fs.writeFile(filePath, buffer);
//         dbFileArray.push(fileName);
//         savedFiles.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//       } catch (fileError) {
//         console.error(`Error processing file ${file.name}:`, fileError);
//         // Continue with next file even if one fails
//         continue;
//       }
//     }

//     if (savedFiles.length === 0) {
//       return NextResponse.json(
//         { error: "No files were successfully uploaded" },
//         { status: 400 }
//       );
//     }

//     value.images = dbFileArray;
//    console.log(value);

//     const response = await productSchema.insertOne(value);

//     value.images = savedFiles;

//     return NextResponse.json({
//       message: "Product added successfully",
//       data: value,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to upload files" },
//       { status: 200 }
//     );
//   }
// });

// update product

// export const POST = withDb(async (request) => {
//   try {
//     const formData = await request.formData();
//     const formEntries = Object.fromEntries(formData.entries());

//     // ✅ Parse variants (skip validation)
//     let variants = [];
//     if (formEntries.variants) {
//       try {
//         variants = JSON.parse(formEntries.variants);
//       } catch (err) {
//         return NextResponse.json(
//           { error: "Invalid variants format (must be JSON)" },
//           { status: 400 }
//         );
//       }
//     }

//     // ✅ Validate basic product fields
//     const { value, error } = validate(productValidationSchema, formEntries);
//     if (error) {
//       return NextResponse.json({ error, isSuccess: false }, { status: 400 });
//     }

//     // ✅ Handle images
//     const files = formData.getAll("images");
//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
//     }

//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     await fs.mkdir(uploadDir, { recursive: true });

//     const savedFiles = [];
//     const dbFileArray = [];

//     for (const file of files) {
//       if (!ALLOWED_MIME_TYPES.includes(file.type)) {
//         return NextResponse.json(
//           { error: `File type ${file.type} not allowed` },
//           { status: 400 }
//         );
//       }

//       if (file.size > MAX_FILE_SIZE) {
//         return NextResponse.json(
//           {
//             error: `File ${file.name} exceeds ${
//               MAX_FILE_SIZE / 1024 / 1024
//             }MB limit`,
//           },
//           { status: 400 }
//         );
//       }

//       try {
//         const fileName = await saveFile(SAVE_PRODUCT_PATH, file, "product");
//         dbFileArray.push(fileName);
//         savedFiles.push(genratePublicUrl(SAVE_PRODUCT_PATH, fileName));
//       } catch (fileError) {
//         console.error(`Error processing file ${file.name}:`, fileError);
//         continue;
//       }
//     }

//     if (savedFiles.length === 0) {
//       return NextResponse.json(
//         { error: "No files were successfully uploaded" },
//         { status: 400 }
//       );
//     }

//     // ✅ Prepare data for DB insert
//     value.images = dbFileArray;
//     value.variants = variants;
//     console.log(value);

//     const result = await productSchema.insertOne(value);
//     value._id = result.insertedId;
//     value.images = savedFiles;

//     return NextResponse.json({
//       message: "Product added successfully",
//       data: value,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to upload files" },
//       { status: 500 }
//     );
//   }
// });

// export const PUT = asyncHandler(async (request) => {
//   try {
//     await connectToDB();

//     const url = new URL(request.url);
//     const id = url.searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Product ID is required" },
//         { status: 400 }
//       );
//     }

//     const formData = await request.formData();

//     const body = {};
//     for (const [key, value] of formData.entries()) {
//       body[key] = value;
//     }

//     const updatedProduct = await productSchema.findByIdAndUpdate(
//       id,
//       { $set: body },
//       { new: true }
//     );

//     if (!updatedProduct) {
//       return NextResponse.json({ error: "Product not found" }, { status: 404 });
//     }

//     return NextResponse.json({
//       data: updatedProduct,
//       message: "Product updated successfully",
//     });
//   } catch (error) {
//     console.error("Update error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to update product" },
//       { status: 500 }
//     );
//   }
// });

// // export async function PUT(request) {
// //   try {
// //     await connectToDB();

// //     const url = new URL(request.url);
// //     const id = url.searchParams.get("id");

// //     if (!id) {
// //       return NextResponse.json(
// //         { error: "Product ID is required" },
// //         { status: 400 }
// //       );
// //     }

// //     const body = await request.formData();
// //  console.log(body);

// //     const updatedProduct = await productSchema.findByIdAndUpdate(
// //       id,
// //       { $set: body },
// //       { new: true }
// //     );

// //     console.log(updatedProduct);

// //     if (!updatedProduct) {
// //       return NextResponse.json({ error: "Product not found" }, { status: 404 });
// //     }

// //     return NextResponse.json({
// //       data: updatedProduct,
// //       message: "Product updated successfully",
// //     });
// //   } catch (error) {
// //     console.error("Update error:", error);
// //     return NextResponse.json(
// //       { error: error.message || "Failed to update product" },
// //       { status: 500 }
// //     );
// //   }
// // }
// // delete product
// export const Delete = asyncHandler(async (request) => {
//   try {
//     await connectToDB();

//     const { searchParams } = new URL(request.url);
//     const id = searchParams.get("id");

//     if (!id) {
//       return NextResponse.json(
//         { error: "Product ID is required", isSuccess: false },
//         { status: 400 }
//       );
//     }

//     // Perform soft delete by setting deleted flag and deletedAt timestamp
//     const deletedProduct = await productSchema.findByIdAndUpdate(
//       id,
//       {
//         $set: {
//           deleted: true,
//           deletedAt: new Date(),
//         },
//       },
//       { new: true }
//     );

//     if (!deletedProduct) {
//       return NextResponse.json(
//         { error: "Product not found", isSuccess: false },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({
//       message: "Product deleted successfully",
//       data: deletedProduct,
//       isSuccess: true,
//     });
//   } catch (error) {
//     console.error("Delete error:", error);
//     return NextResponse.json(
//       {
//         error: error.message || "Failed to delete product",
//         isSuccess: false,
//       },
//       { status: 500 }
//     );
//   }
// });

// // app/api/upload/route.js
// import { NextResponse } from "next/server";
// // import fs from "fs/promises";
// // import path from "path";

// // // Configuration
// // const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
// // const ALLOWED_MIME_TYPES = [
// //   "image/jpeg",
// //   "image/png",
// //   "image/webp",
// //   "image/gif",
// // ];

// export async function POST(request) {
//   try {
//     // Get form data

//     const formData = await request.formData();
//     const files = formData.getAll("images");

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
//     }

//     // Create upload directory if it doesn't exist
//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     await fs.mkdir(uploadDir, { recursive: true });

//     // Process files sequentially to reduce memory pressure
//     const savedFiles = [];

//     for (const file of files) {
//       try {
//         // Validate file type
//         if (!ALLOWED_MIME_TYPES.includes(file.type)) {
//           throw new Error(`File type ${file.type} not allowed`);
//         }

//         // Validate file size
//         if (file.size > MAX_FILE_SIZE) {
//           throw new Error(
//             `File ${file.name} exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit`
//           );
//         }

//         // Generate unique filename
//         const fileExt = path.extname(file.name);
//         const fileName = `${Date.now()}-${Math.random()
//           .toString(36)
//           .substring(2, 9)}${fileExt}`;
//         const filePath = path.join(uploadDir, fileName);

//         // Stream file to disk in chunks to avoid memory issues
//         const buffer = Buffer.from(await file.arrayBuffer());
//         await fs.writeFile(filePath, buffer);

//         savedFiles.push({
//           originalName: file.name,
//           fileName: fileName,
//           path: `http://localhost:3000/uploads/${fileName}`, // Use relative path
//           size: file.size,
//           type: file.type,
//         });
//       }
//     }

//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to upload files" },
//       { status: 200 }
//     );
//   }

// }

// export const config = {
//   api: {
//     bodyParser: false, // Disable default bodyParser for file uploads
//   },
// };

// // app/api/upload/route.js
// import { NextResponse } from "next/server";
// import fs from "fs/promises";
// import path from "path";

// export async function POST(request) {
//   try {
//     // Get form data from request
//     const formData = await request.formData();
//     const files = formData.getAll("images");

//     console.log(files);

//     // Validate files
//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
//     }

//     // Create upload directory if it doesn't exist
//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     await fs.mkdir(uploadDir, { recursive: true });

//     // Process and save each file
//     const savedFiles = await Promise.all(
//       files.map(async (file) => {
//         // Validate file type (only images)
//         if (!file.type.startsWith("image/")) {
//           throw new Error(`File ${file.name} is not an image`);
//         }

//         // Generate unique filename
//         const fileExt = path.extname(file.name);
//         const fileName = `${Date.now()}-${Math.random()
//           .toString(36)
//           .substring(2, 9)}${fileExt}`;
//         const filePath = path.join(uploadDir, fileName);

//         // Convert file to buffer and save
//         const buffer = Buffer.from(await file.arrayBuffer());
//         await fs.writeFile(filePath, buffer);

//         return {
//           name: fileName,
//           path: `http://localhost:3000/uploads/${fileName}`,
//           size: file.size,
//           type: file.type,
//         };
//       })
//     );

//     return NextResponse.json({
//       message: "Images uploaded successfully",
//       files: savedFiles,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: "Failed to upload images" },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from 'next/server';
// import formidable from 'formidable';
// import path from 'path';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function  POST(req) {
//     const formData = await req.formData();
//     const files = formData.getAll('images');
//     console.log("files========",files);

// }

// import { NextResponse } from 'next/server';
// import formidable from 'formidable';
// import path from 'path';

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req) {
//   const form = formidable({
//     multiples: false,
//     uploadDir: path.join(process.cwd(), '/public/uploads'),
//     keepExtensions: true,
//   });

//   try {
//     const data = await new Promise((resolve, reject) => {
//       form.parse(req, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//     if (!data.files.file) {
//       return NextResponse.json(
//         { error: 'No file uploaded' },
//         { status: 400 }
//       );
//     }

//     const file = data.files.file;
//     return NextResponse.json(
//       {
//         message: 'File uploaded successfully',
//         filename: path.basename(file.filepath),
//         path: `/uploads/${path.basename(file.filepath)}`,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     // Return proper JSON error for Postman or any client
//     return NextResponse.json(
//       { error: error.message || 'Something went wrong' },
//       { status: 500 }
//     );
//   }
// }
// // app/api/upload/route.js
// import { NextResponse } from 'next/server';
// import fs from 'fs/promises';
// import path from 'path';

// export async function POST(request) {
//   try {
//     // Get form data from request
//     const formData = await request.formData();
//     const files = formData.getAll('images');

//     console.log(files);

//     // Validate files
//     if (!files || files.length === 0) {
//       return NextResponse.json(
//         { error: 'No files uploaded' },
//         { status: 400 }
//       );
//     }

//     // Create upload directory if it doesn't exist
//     const uploadDir = path.join(process.cwd(), 'public/uploads');
//     await fs.mkdir(uploadDir, { recursive: true });

//     // Process and save each file
//     const savedFiles = await Promise.all(
//       files.map(async (file) => {
//         // Validate file type (only images)
//         if (!file.type.startsWith('image/')) {
//           throw new Error(`File ${file.name} is not an image`);
//         }

//         // Generate unique filename
//         const fileExt = path.extname(file.name);
//         const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExt}`;
//         const filePath = path.join(uploadDir, fileName);

//         // Convert file to buffer and save
//         const buffer = Buffer.from(await file.arrayBuffer());
//         await fs.writeFile(filePath, buffer);

//         return {
//           name: fileName,
//           path: `/uploads/${fileName}`,
//           size: file.size,
//           type: file.type,
//         };
//       })
//     );

//     return NextResponse.json({
//       message: 'Images uploaded successfully',
//       files: savedFiles,
//     });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { error: 'Failed to upload images' },
//       { status: 500 }
//     );
//   }
// }

// app/upload/page.js
// 'use client';
// import { useState } from 'react';

// export default function UploadPage() {
//   const [files, setFiles] = useState([]);
//   const [uploadStatus, setUploadStatus] = useState(null);
//   const [uploadedFiles, setUploadedFiles] = useState([]);

//   const handleFileChange = (e) => {
//     if (e.target.files) {
//       setFiles(Array.from(e.target.files));
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (files.length === 0) {
//       setUploadStatus('Please select at least one image');
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file) => formData.append('images', file));

//     try {
//       const response = await fetch('/api/upload', {
//         method: 'POST',
//         body: formData,
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setUploadStatus('Upload successful!');
//         setUploadedFiles(data.files);
//         setFiles([]);
//       } else {
//         setUploadStatus(data.error || 'Upload failed');
//       }
//     } catch (error) {
//       setUploadStatus('Upload failed');
//       console.error('Upload error:', error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">Multiple Image Upload</h1>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <input
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleFileChange}
//           className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded-md file:border-0
//             file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100"
//         />
//         <button
//           type="submit"
//           className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//         >
//           Upload Images
//         </button>
//       </form>
//       {uploadStatus && (
//         <p className={`mt-4 ${uploadStatus.includes('successful') ? 'text-green-600' : 'text-red-600'}`}>
//           {uploadStatus}
//         </p>
//       )}
//       {uploadedFiles.length > 0 && (
//         <div className="mt-6">
//           <h2 className="text-xl font-semibold mb-2">Uploaded Images</h2>
//           <div className="grid grid-cols-2 gap-4">
//             {uploadedFiles.map((file, index) => (
//               <div key={index} className="border rounded-md p-2">
//                 <img
//                   src={file.path}
//                   alt={file.name}
//                   className="w-full h-32 object-cover rounded"
//                 />
//                 <p className="text-sm mt-2">{file.name}</p>
//                 <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(2)} KB</p>
//               </div>
//             ))}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
// ```

// // src/app/api/admin/product/create/route.js

// import { NextResponse } from "next/server";
// import formidable from "formidable";
// import fs from "fs";
// import path from "path";

// // ✅ Ensure this API uses Node.js runtime
// export const runtime = "nodejs";

// // ✅ Disable default body parser (required for file upload)
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Helper function to parse form with formidable
// function parseForm(req) {
//   return new Promise((resolve, reject) => {
//     const form = formidable({
//       multiples: true,
//       uploadDir: path.join(process.cwd(), "/public/uploads"),
//       keepExtensions: true,
//     });

//     // ⚠️ req must be a Node.js IncomingMessage (not a web Request)
//     form.parse(req, (err, fields, files) => {
//       if (err) reject(err);
//       resolve({ fields, files });
//     });
//   });
// }

// export async function POST(req) {
//   try {
//     // ⚠️ Convert Next.js Request to Node.js req (using req asReadableStream is not possible)
//     // So instead, use `req` from the `node` context by defining a custom handler with Next.js API routes OR workaround
//     throw new Error("formidable works only in Pages Router or via custom Express server in App Router");

//     // Example only if using Express or Pages router
//     // const { fields, files } = await parseForm(req);

//     // return NextResponse.json({ message: "Success", fields, files });
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// export async function POST(req) {
//   const formData = await req.formData();
//   const title = formData.get("title");
//   const files = formData.get("images"); // assuming image is the input name

//   console.log(title, files,);
//   return new Response("FormData received");
// }

// const { NextResponse } = require("next/server");
// const multer = require("multer");
// const path = require("path");
// const { promises: fs } = require("fs");

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), "uploads");
//     // Ensure uploads directory exists
//     try {
//       await fs.mkdir(uploadDir, { recursive: true });
//       cb(null, uploadDir);
//     } catch (error) {
//       cb(error, uploadDir);
//     }
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // Initialize multer with storage and file limits
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB per file
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error("Only JPEG, PNG, and GIF images are allowed"), false);
//     }
//   },
// }).array("images", 10); // Allow up to 10 images in the 'images' field

// // Handler for POST requests
// async function POST(req) {
//   try {
//     // Wrap multer in a promise to handle async
//     const formData = await new Promise((resolve, reject) => {
//       upload(req, {}, (err) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(req);
//       });
//     });

//     console.log("Request body:", req.body);
//     console.log("Request files:", req.files);
//     // const req.formData();
//     console.log(
//       "formData==========================",
//       formData.file,
//       formData.files
//     );

//     const files = formData.files;
//     if (!files || files.length === 0) {
//       return NextResponse.json(
//         { error: "No images uploaded" },
//         { status: 400 }
//       );
//     }

//     // Prepare response with file details
//     const uploadedFiles = files.map((file) => ({
//       filename: file.filename,
//       path: `/uploads/${file.filename}`,
//       size: file.size,
//       mimetype: file.mimetype,
//     }));

//     return NextResponse.json(
//       {
//         message: "Images uploaded successfully",
//         files: uploadedFiles,
//       },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to upload images" },
//       { status: 500 }
//     );
//   }
// }

// module.exports = { POST };

// import { NextResponse } from 'next/server';
// import multer from 'multer';
// import path from 'path';
// import { promises as fs } from 'fs';

// // Configure multer storage
// const storage = multer.diskStorage({
//   destination: async (req, file, cb) => {
//     const uploadDir = path.join(process.cwd(), 'uploads');
//     // Ensure uploads directory exists
//     try {
//       await fs.mkdir(uploadDir, { recursive: true });
//       cb(null, uploadDir);
//     } catch (error) {
//       cb(error, uploadDir);
//     }
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// // Initialize multer with storage and file limits
// const upload = multer({
//   storage,
//   limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB per file
//   fileFilter: (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//       cb(null, true);
//     } else {
//       cb(new Error('Only JPEG, PNG, and GIF images are allowed'), false);
//     }
//   },
// }).array('images', 10); // Allow up to 10 images in the 'images' field

// // Handler for POST requests
// export async function POST(req) {
//   try {
//     // Wrap multer in a promise to handle async
//     const formData = await new Promise((resolve, reject) => {
//       upload(req, {}, (err) => {
//         if (err) {
//           return reject(err);
//         }
//         resolve(req);
//       });
//     });

//     const files = formData.files;

//     console.log(files);

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: 'No images uploaded' }, { status: 400 });
//     }

//     // Prepare response with file details
//     const uploadedFiles = files.map(file => ({
//       filename: file.filename,
//       path: `/uploads/${file.filename}`,
//       size: file.size,
//       mimetype: file.mimetype,
//     }));

//     return NextResponse.json({
//       message: 'Images uploaded successfully',
//       files: uploadedFiles,
//     }, { status: 200 });
//   } catch (error) {
//     console.error('Upload error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Failed to upload images' },
//       { status: 500 }
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import formidable from "formidable";
// import fs from "fs";
// import { Readable } from "stream";

// // Required to disable body parsing in App Router
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// // Convert Web API Request to Node stream
// function toNodeReadable(webRequest) {
//   const reader = webRequest.body.getReader();

//   return new Readable({
//     async read() {
//       try {
//         const { done, value } = await reader.read();
//         if (done) this.push(null);
//         else this.push(Buffer.from(value));
//       } catch (err) {
//         this.destroy(err);
//       }
//     },
//   });
// }

// export async function POST(req) {
//   try {
//     const nodeReq = toNodeReadable(req);

//     // Required fields for formidable to work in Next.js App Router
//     nodeReq.headers = Object.fromEntries(req.headers);
//     nodeReq.method = req.method;
//     nodeReq.url = ""; // Required dummy value

//     const form = formidable({
//       multiples: true,
//       uploadDir: "public/uploads",
//       keepExtensions: true,
//       filename: (name, ext, part) => `${Date.now()}-${part.originalFilename}`,
//     });

//     const { fields, files } = await new Promise((resolve, reject) => {
//       form.parse(nodeReq, (err, fields, files) => {
//         if (err) reject(err);
//         else resolve({ fields, files });
//       });
//     });

//     const images = files.images || files["images[]"];
//     const imagePaths = Array.isArray(images)
//       ? images.map((img) => img.filepath.replace("public", ""))
//       : [images?.filepath?.replace("public", "")];

//     return NextResponse.json({
//       status: "success",
//       message: "Images uploaded successfully",
//       paths: imagePaths,
//     });
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { status: "error", message: "Upload failed", error: error.message },
//       { status: 500 }
//     );
//   }
// }

// // src/app/api/admin/product/create/route.js
// import { NextResponse } from "next/server";
// import { writeFile } from "fs/promises";
// import path from "path";

// export async function POST(request) {
//   try {
//     // Check if the content-type is multipart/form-data
//     const contentType = request.headers.get("content-type");
//     if (!contentType || !contentType.includes("multipart/form-data")) {
//       return NextResponse.json(
//         { error: "Invalid content-type. Expected multipart/form-data" },
//         { status: 400 }
//       );
//     }

//     // Get form data
//     const formData = await request.formData();
//     const files = formData.getAll("images");

//     if (!files || files.length === 0) {
//       return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
//     }

//     // Create upload directory if it doesn't exist
//     const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
//     await require("fs").promises.mkdir(uploadDir, { recursive: true });

//     const uploadedFiles = [];

//     for (const file of files) {
//       // Skip if it's not a file (could be a text field)
//       if (typeof file === "string") continue;

//       // Validate file type
//       if (!file.type.startsWith("image/")) {
//         continue; // or return error if you want to reject the whole request
//       }

//       // Generate unique filename
//       const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//       const ext = path.extname(file.name);
//       const filename = `product-${uniqueSuffix}${ext}`;
//       const filePath = path.join(uploadDir, filename);

//       // Convert file to buffer and save
//       const buffer = Buffer.from(await file.arrayBuffer());
//       await writeFile(filePath, buffer);

//       uploadedFiles.push({
//         originalName: file.name,
//         fileName: filename,
//         path: `/uploads/products/${filename}`,
//         size: file.size,
//         type: file.type,
//       });
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Product created successfully",
//       files: uploadedFiles,
//       // Include other product data as needed
//     });
//   } catch (error) {
//     console.error("Error in product creation:", error);
//     return NextResponse.json(
//       { error: error.message || "Failed to create product" },
//       { status: 500 }
//     );
//   }
// }

// export async function GET() {
//   return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
// }

// import { writeFile } from "fs/promises";
// import path from "path";
// import { NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false, // This is crucial for file uploads
//   },
// };

// export async function POST(request) {
//   try {
//     // Check if the content-type is multipart/form-data
//     const contentType = request.headers.get("content-type");
//     if (!contentType?.includes("multipart/form-data")) {
//       return NextResponse.json(
//         { error: "Invalid content-type. Expected multipart/form-data" },
//         { status: 400 }
//       );
//     }

//     const formData = await request.formData();
//     const files = formData.getAll("images");

//     if (!files || files.length === 0) {
//       return NextResponse.json(
//         { error: "No files received." },
//         { status: 400 }
//       );
//     }

//     console.log("Received files:", files);

//     // Rest of your file processing logic...
//     const uploadDir = path.join(process.cwd(), "public/uploads");
//     const uploadedPaths = [];

//     for (const file of files) {
//       if (typeof file === "object" && "arrayBuffer" in file) {
//         const buffer = Buffer.from(await file.arrayBuffer());
//         const filename = `${Date.now()}-${file.name}`;
//         const filepath = path.join(uploadDir, filename);
//         await writeFile(filepath, buffer);
//         uploadedPaths.push(`/uploads/${filename}`);
//       }
//     }

//     return NextResponse.json({
//       success: true,
//       message: "Files uploaded successfully!",
//       files: uploadedPaths,
//     });
//   } catch (error) {
//     console.error("Error during file upload:", error);
//     return NextResponse.json(
//       { error: error.message || "Something went wrong during file upload." },
//       { status: 500 }
//     );
//   }
// }
// import { writeFile } from "fs/promises";
// import path from "path";
// import { NextResponse } from "next/server";

// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req) {
//   const formData = await req.formData();
//   const file = formData.get("image");

//   if (!file) {
//     return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
//   }

//   const bytes = await file.arrayBuffer();
//   const buffer = Buffer.from(bytes);
//   const filename = `${Date.now()}-${file.name}`;
//   const filePath = path.join(process.cwd(), "public/uploads", filename);

//   await writeFile(filePath, buffer);

//   return NextResponse.json({
//     message: "Image uploaded successfully!",
//     path: `/uploads/${filename}`,
//   });
// }

// import fs from "fs";
// import path from "path";

// export const config = {
//   api: {
//     bodyParser: false, // Disable bodyParser to handle large files
//   },
// };

// export default async function handler(req, res) {
//   console.log(req.method);

//   if (req.method === "POST") {
//     const chunks = [];

//     req.on("data", (chunk) => {
//       chunks.push(chunk);
//     });

//     req.on("end", () => {
//       const buffer = Buffer.concat(chunks);
//       const filePath = path.resolve(".", "uploads", "image.png"); // Saves to the `uploads` folder

//       fs.writeFileSync(filePath, buffer);
//       res.status(200).json({ message: "File uploaded successfully" });
//     });
//   } else {
//     res.status(405).json({ message: "Method not allowed" });
//   }
// }

// import { NextResponse } from "next/server";
// import User from "@/model/Userschema";
// import connectToDB from "@/lib/dbConnect";
// import { upload } from "@/lib/multerConfig";
// import { runMiddleware } from "@/lib/runMiddleware";
// // import { runMiddleware } from "@/lib/middleware";

// // Turn off body parser
// export const config = {
//   api: {
//     bodyParser: false,
//   },
// };

// export async function POST(req, res) {
//   await connectToDB();

//   // Convert to Node.js request (needed for multer)
//   const nodeReq = req;
//   const nodeRes = res || new Response();

//   try {
//     await runMiddleware(nodeReq, nodeRes, upload.array("images", 10)); // max 10 files

//     const formData = await new Promise((resolve, reject) => {
//       const body = {};
//       nodeReq.on("field", (key, value) => {
//         body[key] = value;
//       });
//       nodeReq.on("end", () => resolve(body));
//     });

//     const files = nodeReq.files || [];
//     const imagePaths = files.map((file) => "/uploads/" + file.filename);

//     const newUser = await User.create({
//       ...formData,
//       images: imagePaths,
//     });

//     return NextResponse.json(
//       { message: "User created", status: true, user: newUser },
//       { status: 201 }
//     );
//   } catch (error) {
//     console.error("Upload error:", error);
//     return NextResponse.json(
//       { message: "Upload failed", status: false, error: error.message },
//       { status: 500 }
//     );
//   }
// }
