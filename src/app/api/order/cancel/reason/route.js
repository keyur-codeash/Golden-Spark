import { NextResponse } from "next/server";
import orderCancelReasonSchema from "@/model/orderCancelReasonSchema";
import { asyncHandler } from "@/utils/asyncHandler";
import { userAuthentication } from "@/middlewares/auth";
import { validate } from "@/lib/validateSchema";
import { addOrderCancelreasonValidation } from "@/validation/orderCancelReasonValidation";

//  Get All
export const GET = asyncHandler(async () => {
  const result = await orderCancelReasonSchema.find();

  return NextResponse.json(
    {
      isSuccess: true,
      data: result,
      message: "Order cancel reasons fetched successfully!",
    },
    { status: 200 }
  );
});

// Create
export const POST = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();

  // Validate order data
  const { error } = validate(addOrderCancelreasonValidation, body);

  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 400 }
    );
  }

  const response = await orderCancelReasonSchema.create({
    ...body,
    createdBy: userId,
  });

  return NextResponse.json(
    {
      isSuccess: true,
      message: "Order cancel reason added successfully!",
      data: response,
    },
    { status: 201 }
  );
});

// Update
export const PUT = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();

  const { id, ...updateData } = body;

  // Validate order data
  const { error } = validate(addOrderCancelreasonValidation, body);

  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 400 }
    );
  }

  if (!id) {
    return NextResponse.json(
      { isSuccess: false, message: "Reason ID is required for update!" },
      { status: 400 }
    );
  }

  const updatedReason = await orderCancelReasonSchema.findByIdAndUpdate(
    id,
    { ...updateData, updatedBy: userId, updatedAt: new Date() },
    { new: true }
  );

  if (!updatedReason) {
    return NextResponse.json(
      { isSuccess: false, message: "Order cancel reason not found!" },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      isSuccess: true,
      message: "Order cancel reason updated successfully!",
      data: updatedReason,
    },
    { status: 200 }
  );
});

// Delete
export const DELETE = asyncHandler(async (request) => {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { isSuccess: false, message: "Reason ID is required for deletion!" },
      { status: 400 }
    );
  }
  const deletedReason = await orderCancelReasonSchema.findByIdAndDelete(id);
  if (!deletedReason) {
    return NextResponse.json(
      { isSuccess: false, message: "Order cancel reason not found!" },
      { status: 404 }
    );
  }
  return NextResponse.json(
    {
      isSuccess: true,
      message: "Order cancel reason deleted successfully!",
    },
    { status: 200 }
  );
});
