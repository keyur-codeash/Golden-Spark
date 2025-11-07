import mongoose from "mongoose";
import brandSchema from "@/model/brandSchema";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Gets a brand document by ObjectId.
 * @param {string} brandId 
 * @returns {Promise<Object|null>}
 */

export const getBrandById = asyncHandler(async (brandId) => {

  if (!mongoose.Types.ObjectId.isValid(brandId)) {
    return null;
  }

  try {
    const brand = await brandSchema.findById(brandId).lean();

    return brand;
  } catch (error) {
    console.error("Error fetching brand by ID:", error);
    return null;
  }
});
