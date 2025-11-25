import { NextResponse } from "next/server";
import { asyncHandler } from "@/utils/asyncHandler";
import { userAuthentication } from "@/middlewares/auth";
import { validate } from "@/lib/validateSchema";
import orderSchema from "@/model/orderSchema";
import { orderCancelValidation } from "@/validation/orderCancelReasonValidation";

//  Get All
export const GET = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);

  const result = await orderSchema.find({ user: decodedUser.id, cancel: 1 });
  return NextResponse.json(
    {
      isSuccess: true,
      data: result,
      message: "Order cancel reasons fetched successfully!",
    },
    { status: 200 }
  );
});

// Cancel Order
export const PUT = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();

  const { error } = validate(orderCancelValidation, body);

  if (error) {
    return NextResponse.json(
      { isSuccess: false, message: error },
      { status: 400 }
    );
  }

  const findOrder = await orderSchema.find({
    user: userId,
    orderId: body._id,
    cancel: 0,
  });

  if (!findOrder) {
    return NextResponse.json({
      isSuccess: false,
      message: "Order not found",
    });
  }
  const result = await orderSchema.updateMany(
    { user: userId, orderId: body._id },
    {
      $set: {
        cancel: 1,
        cancelReason: body.cancelReason,
        cancelDescription: body.cancelDescription,
      },
    }
  );  

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      message: "Your order has been cancelled successfully!",
    });
  }
});