import connectToDB from "@/lib/dbConnect";
import { validate } from "@/lib/validateSchema";
import sizeSchema from "@/model/sizeSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { idParamSchema } from "@/validation/sizeValidation";
import { updateSizeSchema } from "@/validation/sizeValidation";
// import { idParamSchema, updatesizeSchema } from "@/validation/sizeValidation";
import { NextResponse } from "next/server";

export const PUT = asyncHandler(async (req, { params }) => {
  const body = await req.json();
  const { value, error } = validate(updateSizeSchema, body);
  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 422 }
    );
  }

  const updatedSize = await sizeSchema.findByIdAndUpdate(params.id, value, {
    new: true,
    runValidators: true,
  });

  if (!updatedSize) throw new Error("Size not found");

  return NextResponse.json({
    isSuccess: true,
    data: updatedSize,
    message: "Size updated successfully",
  });
});

export const DELETE = asyncHandler(async (_, { params }) => {
  const { error } = validate(idParamSchema, params);
  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 400 }
    );
  }

  const deletedsizeSchema = await sizeSchema.findByIdAndDelete(params.id);
  if (!deletedsizeSchema) {
    return NextResponse.json({
      isSuccess: true,
      message: "Size not found",
    });
  }
  return NextResponse.json({
    isSuccess: true,
    message: "Size deleted successfully",
  });
});

// import connectToDB from "@/lib/dbConnect";
// import sizeSchema from "@/model/sizeSchema";

// export async function GET(_, { params }) {
//   try {
//     await connectToDB();
//     const result = await sizeSchema.findById(params.id);
//     if (!result) throw new Error("sizeSchema not found");
//     return Response.json({ isSuccess: true, data: sizeSchema });
//   } catch (error) {
//     return Response.json(
//       { isSuccess: false, message: error.message },
//       { status: 404 }
//     );
//   }
// }

// export async function PUT(req, { params }) {
//   try {
//     await connectToDB();
//     const body = await req.json();
//     const updatedsizeSchema = await sizeSchema.findByIdAndUpdate(
//       params.id,
//       body,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );
//     if (!updatedsizeSchema) throw new Error("size not found");
//     return Response.json({ isSuccess: true, data: updatedsizeSchema });
//   } catch (error) {
//     return Response.json(
//       { isSuccess: false, message: error.message },
//       { status: 400 }
//     );
//   }
// }

// export async function DELETE(_, { params }) {
//   try {
//     await connectToDB();
//     const deletedsizeSchema = await sizeSchema.findByIdAndDelete(params.id);
//     if (!deletedsizeSchema) throw new Error("sizeSchema not found");
//     return Response.json({
//       isSuccess: true,
//       message: "sizeSchema deleted successfully",
//     });
//   } catch (error) {
//     return Response.json(
//       { isSuccess: false, message: error.message },
//       { status: 400 }
//     );
//   }
// }
