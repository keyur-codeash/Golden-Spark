import { userAuthentication } from "@/middlewares/auth";
import orderSchema from "@/model/orderSchema";
import trackOrderSchema from "@/model/trackOrderShcema";
import { asyncHandler } from "@/utils/asyncHandler";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export const GET = asyncHandler(async (request, { params }) => {
  const decodedUser = await userAuthentication(request);
  const orderId = params.id;

  if (!orderId) {
    return NextResponse.json({
      isSuccess: false,
      message: "orderId is required",
    });
  }

  const userId = decodedUser.id;

  const resultData = await orderSchema.aggregate([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        orderId: Number(orderId),
        status: { $ne: "Delivered" },
        cancel: 0,
      },
    },

    // Lookup variant
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

    // Group order data
    {
      $group: {
        _id: "$orderId",
        orderCreated: { $first: "$createdAt" },
        deliveryFee: { $first: "$deliveryFee" },
        taxPercentage: { $first: "$tax" },
        paymentMethod: { $first: "$paymentMethod" },
        address: {
          $first: {
            address: "$address",
            city: "$city",
            state: "$state",
            country: "$country",
            zipCode: "$zipCode",
          },
        },
        status: { $first: "$status" },
        cancel: { $first: "$cancel" },
        items: {
          $push: {
            product_name: "$product.title",
            color: "$color.name",
            quantity: "$quantity",
            size: "$size.size",
            price: "$price",
            itemTotal: { $multiply: ["$quantity", "$price"] },
          },
        },
      },
    },

    // Calculate total price of items
    {
      $addFields: {
        itemsTotal: { $sum: "$items.itemTotal" },
      },
    },

    // Calculate tax from percentage
    {
      $addFields: {
        tax: { $multiply: ["$itemsTotal", { $divide: ["$taxPercentage", 100] }] },
      },
    },

    // Calculate grand total 
    {
      $addFields: {
        grandTotal: {
          $add: ["$itemsTotal", "$deliveryFee", "$tax"],
        },
      },
    },

    {
      $project: {
        order_id: "$_id",
        orderCreated: 1,
        deliveryFee: 1,
        tax: 1,    
        paymentMethod: 1,
        address: 1,
        status: 1,
        items: 1,
        itemsTotal: 1,
        grandTotal: 1,
        _id: 0,
      },
    },
  ]);

  return NextResponse.json({
    isSuccess: true,
    data: resultData,
    message: "Orders fetched successfully!",
  });
});