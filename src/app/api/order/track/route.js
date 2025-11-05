import { userAuthentication } from "@/middlewares/auth";
import trackOrderShcema from "@/model/trackOrderShcema";
import { asyncHandler } from "@/utils/asyncHandler";
import { NextResponse } from "next/server";

export const GET = asyncHandler(async (request) => {
  await userAuthentication(request);
  const url = new URL(request.url);
  const orderId = url.searchParams.get("orderId");

  const result = await trackOrderShcema.findOne({ orderId });

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Order tracking data fetched successfully!",
    });
  } else {
    return NextResponse.json(
      {
        isSuccess: false,
        message: `No tracking information found.`,
      },
      { status: 404 }
    );
  }
});

export const PUT = asyncHandler(async (request) => {
  await userAuthentication(request);
  const body = await request.json();

  const result = await trackOrderShcema.updateOne(
    { _id: body._id },
    { $set: body }
  );

  if (result) {
    return NextResponse.json({
      isSuccess: true,
      data: result,
      message: "Order tracking data update successfully!",
    });
  } else {
    return NextResponse.json(
      {
        isSuccess: false,
        message: `No tracking information found.`,
      },
      { status: 404 }
    );
  }
});
