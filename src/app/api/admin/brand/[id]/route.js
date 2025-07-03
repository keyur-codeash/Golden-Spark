import Brand from "@/model/brandSchema";
import { asyncHandler } from "@/utils/asyncHandler";

  export const GET = asyncHandler(async(_, { params }) =>{
    try {
      const brand = await Brand.findById(params.id);
      if (!brand) throw new Error("Brand not found");
      return Response.json({ success: true, data: brand });
    } catch (error) {
      return Response.json(
        { isSuccess: false, message: error.message },
        { status: 404 }
      );
    }
  })

  export const POST = asyncHandler(async(req, { params }) =>{
  try {
    const body = await req.json();
    const updatedBrand = await Brand.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedBrand) throw new Error("Brand not found");
    return Response.json({ isSuccess: true, data: updatedBrand });
  } catch (error) {
    return Response.json(
      { isSuccess: false, message: error.message },
      { status: 400 }
    );
  }
})

  export const DELETE = asyncHandler(async(_, { params }) =>{
  try {
    const deletedBrand = await Brand.findByIdAndDelete(params.id);
    if (!deletedBrand) throw new Error("Brand not found");
    return Response.json({
      isSuccess: true,
      message: "Brand deleted successfully",
    });
  } catch (error) {
    return Response.json(
      { isSuccess: false, message: error.message },
      { status: 400 }
    );
  }
})
