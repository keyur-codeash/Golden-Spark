// utils/getBrandById.js
import mongoose from "mongoose";
import brandSchema from "@/model/brandSchema";
import { asyncHandler } from "@/utils/asyncHandler";

/**
 * Gets a brand document by ObjectId.
 * @param {string} brandId - The brand ObjectId.
 * @returns {Promise<Object|null>} - The brand document or null if not found/invalid.
 */

export const getBrandById = asyncHandler(async (brandId) => {
  // export async function getBrandById(brandId) {

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

// export async function getBrand(_, { params }) {
//   try {
//     await connectToDB();
//     const brand = await brandSchema.findById(params.id);
//     if (!brand) throw new Error("Brand not found");
//     return Response.json({ success: true, data: brand });
//   } catch (error) {
//     return Response.json(
//       { success: false, message: error.message },
//       { status: 404 }
//     );
//   }
// }
