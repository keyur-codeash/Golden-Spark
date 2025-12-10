import { validate } from "@/lib/validateSchema";
import { userAuthentication } from "@/middlewares/auth";
import orderSchema from "@/model/orderSchema";
import trackOrderSchema from "@/model/trackOrderShcema";
import { asyncHandler } from "@/utils/asyncHandler";
import { addSOrderValidation } from "@/validation/orderValidation";
import { NextResponse } from "next/server";
import variantSchema from "../../../model/product_variants";
import mongoose from "mongoose";
import genratePublicUrl from "@/utils/genratePublicUrl";
import addressSchema from "@/model/addressSchema";
const SAVE_PRODUCT_PATH = "backend/product";

export const trackOrder = (createdOrder) => {
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
    orderId: createdOrder.orderId,
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
        completed: false,
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
        completed: true,
      },
    ],
  };

  return trackingData;
};

export const POST = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();

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

  const lastOrder = await orderSchema
    .findOne()
    .sort({ _id: -1 })
    .select("orderId")
    .limit(1);

  for (const orderData of body) {
    const singleOrder = {
      ...orderData,
      user: userId,
      status: "Pending",
      cancel: 0,
    };

    try {
      const { error } = validate(addSOrderValidation, singleOrder);
      if (error) {
        return NextResponse.json(
          { isSuccess: false, message: error },
          { status: 400 }
        );
      }

      const variant = await variantSchema.findById(singleOrder.variantId);
      if (!variant) {
        throw new Error("Variant not found");
      }

      const [productDetails] = await variantSchema.aggregate([
        { $match: { _id: variant._id } },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productName",
            pipeline: [{ $project: { title: 1, _id: 0 } }],
          },
        },
        {
          $lookup: {
            from: "colors",
            localField: "color",
            foreignField: "_id",
            as: "colorName",
            pipeline: [{ $project: { name: 1, _id: 0 } }],
          },
        },
        {
          $lookup: {
            from: "sizes",
            localField: "size",
            foreignField: "_id",
            as: "sizeName",
            pipeline: [{ $project: { size: 1, _id: 0 } }],
          },
        },
        {
          $project: {
            productName: { $arrayElemAt: ["$productName.title", 0] },
            colorName: { $arrayElemAt: ["$colorName.name", 0] },
            sizeName: { $arrayElemAt: ["$sizeName.size", 0] },
          },
        },
      ]);

      if (variant.stock < singleOrder.quantity) {
        failedOrders.push({
          variantId: variant._id,
          message: `Only ${variant.stock} units of ${productDetails?.productName} (${productDetails?.colorName}, ${productDetails?.sizeName}) are available, but you requested ${singleOrder.quantity}.`,
        });
        continue;
        s;
      }

      const addressDetails = await addressSchema.findById(
        singleOrder.addressId
      );
      if (!addressDetails) {
        throw new Error("Address not found");
      }

      singleOrder.address = addressDetails.address;
      singleOrder.city = addressDetails.city;
      singleOrder.state = addressDetails.state;
      singleOrder.country = addressDetails.country;
      singleOrder.zipCode = addressDetails.zipCode;

      // Calculate totals
      const subtotal = singleOrder.price * singleOrder.quantity;
      singleOrder.total =
        subtotal + (singleOrder.deliveryFee || 0) + (singleOrder.tax || 0);

      if (lastOrder?.orderId) {
        singleOrder.orderId = lastOrder.orderId + 1;
      } else {
        singleOrder.orderId = 1;
      }

      const createdOrder = await orderSchema.create(singleOrder);

      await variantSchema.findByIdAndUpdate(
        singleOrder.variantId,
        { $inc: { stock: -singleOrder.quantity } },
        { new: true }
      );

      const trackingData = trackOrder(createdOrder);
      await trackOrderSchema.create(trackingData);
      createdOrders.push(createdOrder);
    } catch (error) {
      failedOrders.push({
        message: error.message || "Something went wrong",
      });
    }
  }

  // Build response
  if (failedOrders.length > 0) {
    return NextResponse.json(
      {
        isSuccess: false,
        totalOrders: body.length,
        createdCount: createdOrders.length,
        failedCount: failedOrders.length,
        failedOrders,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    isSuccess: true,
    message: "Your order has been placed successfully!",
    orderId: createdOrders[0]?.orderId,
  });
});

export const PUT = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;
  const body = await request.json();

  if (!Array.isArray(body) || body.length === 0) {
    return NextResponse.json(
      {
        isSuccess: false,
        message: "Input must be a non-empty array of orders to update.",
      },
      { status: 400 }
    );
  }

  const updatedOrders = [];
  const failedOrders = [];

  for (const orderData of body) {
    try {
      if (!orderData._id) {
        failedOrders.push({
          message: "Order ID (_id) is required for updating.",
        });
        continue;
      }
      const singleOrder = {
        ...orderData,
        user: userId,
      };
      const { error } = validate(addSOrderValidation, singleOrder);
      if (error) {
        failedOrders.push({
          orderId: orderData._id,
          message: error,
        });
        continue;
      }

      // Fetch existing order
      const existingOrder = await orderSchema.findById(orderData._id);
      if (!existingOrder) {
        failedOrders.push({
          orderId: orderData._id,
          message: "Order not found",
        });
        continue;
      }
      if (
        singleOrder.variantId &&
        singleOrder.quantity &&
        singleOrder.variantId.toString() !== existingOrder.variantId.toString()
      ) {
        const variant = await variantSchema.findById(singleOrder.variantId);
        if (!variant) {
          failedOrders.push({
            orderId: orderData._id,
            message: "Variant not found",
          });
          continue;
        }

        if (variant.stock < singleOrder.quantity) {
          failedOrders.push({
            orderId: orderData._id,
            message: `Only ${variant.stock} units available for this variant, but you requested ${singleOrder.quantity}.`,
          });
          continue;
        }
      }

      // Recalculate totals
      const subtotal =
        (singleOrder.price ?? existingOrder.price) *
        (singleOrder.quantity ?? existingOrder.quantity);
      singleOrder.total =
        subtotal +
        (singleOrder.deliveryFee ?? existingOrder.deliveryFee ?? 0) +
        (singleOrder.tax ?? existingOrder.tax ?? 0);

      // Perform update
      const updatedOrder = await orderSchema.findByIdAndUpdate(
        orderData._id,
        { $set: singleOrder },
        { new: true }
      );

      // Save tracking record
      const trackingData = trackOrder(updatedOrder);
      await trackOrderSchema.create(trackingData);

      updatedOrders.push(updatedOrder);
    } catch (error) {
      failedOrders.push({
        orderId: orderData._id,
        message: error.message || "Something went wrong during update",
      });
    }
  }

  // Build response
  if (failedOrders.length > 0) {
    return NextResponse.json(
      {
        isSuccess: false,
        totalOrders: body.length,
        updatedCount: updatedOrders.length,
        failedCount: failedOrders.length,
        failedOrders,
      },
      { status: 200 }
    );
  }

  return NextResponse.json({
    isSuccess: true,
    message: "Orders updated successfully!",
    updatedCount: updatedOrders.length,
  });
});

export const GET = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;

  // Get search params from the request URL
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "Pending";
  const matchStage =
    status === "Cancelled"
      ? { user: new mongoose.Types.ObjectId(userId), cancel: 1 }
      : { user: new mongoose.Types.ObjectId(userId), status, cancel: 0 };

  const resultData = await orderSchema.aggregate([
    {
      $match: matchStage,
    },
    // Lookup
    {
      $lookup: {
        from: "variants",
        localField: "variantId",
        foreignField: "_id",
        as: "variant",
      },
    },
    { $unwind: { path: "$variant", preserveNullAndEmptyArrays: true } },

    // Lookup size
    {
      $lookup: {
        from: "sizes",
        localField: "variant.size",
        foreignField: "_id",
        as: "size",
      },
    },
    { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },

    // Lookup color
    {
      $lookup: {
        from: "colors",
        localField: "variant.color",
        foreignField: "_id",
        as: "color",
      },
    },
    { $unwind: { path: "$color", preserveNullAndEmptyArrays: true } },

    // Lookup product
    {
      $lookup: {
        from: "products",
        localField: "variant.productId",
        foreignField: "_id",
        as: "product",
      },
    },
    { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

    {
      $project: {
        _id: 0,
        order_id: "$orderId",
        product_name: "$product.title",
        color: "$color.name",
        quantity: 1,
        size: "$size.size",
        price: "$price",
        itemTotal: { $multiply: ["$quantity", "$price"] },
        orderCreated: "$createdAt",
        status: 1,
        image: { $arrayElemAt: ["$product.images", 0] },
      },
    },

    {
      $sort: { orderCreated: -1 },
    },
  ]);

  const data = resultData.map((item) => ({
    ...item,
    image: genratePublicUrl(SAVE_PRODUCT_PATH, item?.image),
  }));

  return NextResponse.json({
    isSuccess: true,
    message: `Orders fetched successfully!`,
    data,
  });
});
