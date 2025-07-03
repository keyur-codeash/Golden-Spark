import { validate } from "@/lib/validateSchema";
import { userAuthentication } from "@/middlewares/auth";
import orderSchema from "@/model/orderSchema";
import trackOrderSchema from "@/model/trackOrderShcema";
import { asyncHandler } from "@/utils/asyncHandler";
import { addSOrderValidation } from "@/validation/orderValidation";
import { NextResponse } from "next/server";

export const trackOrder = (createdOrder) => {
  console.log(createdOrder);

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const createdAt = new Date(createdOrder.createdAt);
  const shippedDate = new Date(createdAt);
  const arrivingDate = new Date(createdAt);
  shippedDate.setDate(shippedDate.getDate() + 1);
  arrivingDate.setDate(arrivingDate.getDate() + 3);

  const formatDate = (date, prefix = "") => {
    const day = dayNames[date.getDay()];
    const dateNum = date.getDate();
    const month = monthNames[date.getMonth()];
    return `${prefix}${day}, ${dateNum} ${month}`;
  };

  const trackingData = {
    orderId: createdOrder._id,
    arrivingBy: `by ${
      monthNames[arrivingDate.getMonth()]
    }, ${arrivingDate.getDate()} ${monthNames[arrivingDate.getMonth()]}`,
    shipped: "Tomorrow",
    shipped_date: formatDate(shippedDate),
    events: [
      {
        status: `Arriving: by ${
          monthNames[arrivingDate.getMonth()]
        }, ${arrivingDate.getDate()} ${monthNames[arrivingDate.getMonth()]}`,
        completed: true,
      },
      {
        status: `Shipped: Tomorrow`,
        date: formatDate(shippedDate),
        completed: false,
      },
      {
        status: "Item packed in dispatch warehouse",
        time: "12:23PM",
        completed: false,
      },
      {
        status: "Order Placed",
        date: `on ${formatDate(createdAt)}`,
        completed: false,
      },
    ],
  };

  return trackingData;
};

// Add Orders
export const POST = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();

  // Validate input format
  if (!Array.isArray(body) || body.length === 0) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Input must be a non-empty array of orders.",
      },
      { status: 400 }
    );
  }

  const createdOrders = [];
  const failedOrders = [];

  // Process each order sequentially
  for (const [index, orderData] of body.entries()) {
    const singleOrder = {
      ...orderData,
      user: userId,
      status: "Pending",
      cancel: 0,
    };

    try {
      const { error } = validate(addSOrderValidation, singleOrder);
      if (error) {
        return NextResponse.json({ error, isSuccess: false }, { status: 400 });
      }
      // Create order in DB
      const subtotal = singleOrder.price * singleOrder.quantity;
      singleOrder.total =
        subtotal + (singleOrder.deliveryFee || 0) + (singleOrder.tax || 0);
      const createdOrder = await orderSchema.create(singleOrder);
      if (createdOrder) {
        const trackingData = trackOrder(createdOrder);
        console.log("trackingData==========", trackingData);

        const result = await trackOrderSchema.create(trackingData);
      }
      createdOrders.push(createdOrder);
    } catch (error) {
      failedOrders.push({
        orderIndex: index,
        orderData: singleOrder,
        error: error.message,
      });
    }
  }

  // Prepare response
  const response = {
    isSuccess: failedOrders.length === 0,
    totalOrders: body.length,
    createdCount: createdOrders.length,
    failedCount: failedOrders.length,
  };

  // Only include failed orders if there are any
  if (failedOrders.length > 0) {
    response.failedOrders = failedOrders;
    return NextResponse.json({ isSuccess: false, message: response });
  }

  return NextResponse.json({
    isSuccess: true,
    message: "Your order has been placed successfully!",
  });
});

// Cancel Orders
export const PUT = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();
  const findOrder = await orderSchema.findOne({
    user: userId,
    _id: body._id,
    cancel: 0,
  });

  if (!findOrder) {
    return NextResponse.json({
      isSuccess: false,
      message: "Order not found",
    });
  }
  const result = await orderSchema.updateOne(
    { user: userId, _id: body._id },
    {
      $set: {
        cancel: 1,
        cancelReason: body.cancelReason,
      },
    }
  );
  if (result) {
    return NextResponse.json({
      isSuccess: false,
      message: "Your order has been cancelled successfully!",
    });
  }
});

// Get Orders
export const GET = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const result = await orderSchema.find({ user: userId, cancel: 0 });

  return NextResponse.json({
    isSuccess: true,
    data: result,
    message: "Orders fetch succesfully!",
  });
});
