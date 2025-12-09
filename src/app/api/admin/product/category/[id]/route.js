import categorySchema from "@/model/categorySchema";
import productSchema from "@/model/productSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async (_, { params }) => {
  try {
    const brand = await categorySchema.findById(params.id);
    if (!brand) throw new Error("categorySchema not found");
    return Response.json({ isSuccess: true, data: brand });
  } catch (error) {
    return Response.json(
      { isSuccess: false, message: error.message },
      { status: 404 }
    );
  }
});

export const POST = asyncHandler(async (req, { params }) => {
  try {
    const body = await req.json();
    const { name, status } = body;

    // Check if new name already exists
    if (name) {
      const existingCategory = await categorySchema.findOne({
        name,
        status: 1,
        _id: { $ne: params.id },
      });
      if (existingCategory) {
        return NextResponse.json(
          {
            isSuccess: false,
            message: `Category with name '${name}' already exists.`,
          },
          { status: 409 }
        );
      }
    }

    // Update category
    const updatedCategory = await categorySchema.findByIdAndUpdate(
      params.id,
      body,
      {
        new: true,
        runValidators: true,
      }
    );

    // console.log("updated data==========", updatedCategory);
    // if (!updatedCategory.status) {
    //   await productSchema.updateMany(
    //     { category: updatedCategory._id },
    //     { $set: { isAvailable: 0 } }
    //   );
    // } else {
    //   await productSchema.updateMany(
    //     { category: updatedCategory._id },
    //     { $set: { isAvailable: 1 } }
    //   );
    // }

    if (!updatedCategory) {
      return NextResponse.json(
        { isSuccess: false, message: "Category not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ isSuccess: true, data: updatedCategory });
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      {
        isSuccess: false,
        message: "An unexpected error occurred while updating the category.",
      },
      { status: 500 }
    );
  }
});

// export const POST = asyncHandler(async (req, { params }) => {
//   try {
//     const body = await req.json();
//     const updatedBrand = await categorySchema.findByIdAndUpdate(
//       params.id,
//       body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     if (!updatedBrand) throw new Error("categorySchema not found");
//     return Response.json({ isSuccess: true, data: updatedBrand });
//   } catch (error) {
//     return Response.json(
//       { isSuccess: false, message: error.message },
//       { status: 400 }
//     );
//   }
// });

export const DELETE = asyncHandler(async (_, { params }) => {
  try {
    const deletedBrand = await categorySchema.findByIdAndDelete(params.id);
    if (!deletedBrand) throw new Error("categorySchema not found");
    return Response.json({
      isSuccess: true,
      message: "Cagetory deleted successfully",
    });
  } catch (error) {
    return Response.json(
      { isSuccess: false, message: error.message },
      { status: 400 }
    );
  }
});

export const dynamic = "force-static";
