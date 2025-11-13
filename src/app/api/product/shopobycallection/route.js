import Brand from "@/model/brandSchema";
import Product from "@/model/productSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import genratePublicUrl from "@/utils/genratePublicUrl";
import { NextResponse } from "next/server";
const SAVE_PRODUCT_PATH = "backend/product";

export const GET = asyncHandler(async () => {
  const brands = await Brand.find();

  const result = await Promise.all(
    brands.map(async (brand) => {
      const product = await Product.findOne({ brand: brand._id });
      if (product) {
        return {
          product_id: product._id,
          brand_id: brand._id,
          name: brand.name,
          image:
            genratePublicUrl(SAVE_PRODUCT_PATH, product?.images[0]) || null,
          // images: product.images,
        };
      }
      return null;
    })
  );

  const filteredResult = result.filter(Boolean);

  return NextResponse.json({
    isSuccess: true,
    data: filteredResult,
  });
});
