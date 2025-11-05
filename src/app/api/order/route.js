import { validate } from "@/lib/validateSchema";
import { userAuthentication } from "@/middlewares/auth";
import orderSchema from "@/model/orderSchema";
import trackOrderSchema from "@/model/trackOrderShcema";
import { asyncHandler } from "@/utils/asyncHandler";
import { addSOrderValidation } from "@/validation/orderValidation";
import { NextResponse } from "next/server";
import variantSchema from "../../../model/product_variants";
// import productSchema from "@/model/productSchema";
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

  console.log("createdOrder====", createdOrder, createdOrder.orderId);

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

// Add Orders
// export const POST = asyncHandler(async (request) => {
//   const decodedUser = await userAuthentication(request);
//   const userId = decodedUser.id;
//   const body = await request.json();

//   // Validate input format
//   if (!Array.isArray(body) || body.length === 0) {
//     return NextResponse.json(
//       {
//         isSuccess: false,
//         message: "Input must be a non-empty array of orders.",
//       },
//       { status: 400 }
//     );
//   }

//   const createdOrders = [];
//   const failedOrders = [];

//   // First, validate all orders and check stock availability
//   const stockValidationResults = [];

//   for (const [index, orderData] of body.entries()) {
//     const singleOrder = {
//       ...orderData,
//       user: userId,
//       status: "Pending",
//       cancel: 0,
//     };

//     try {
//       // Validate order schema
//       const { error } = validate(addSOrderValidation, singleOrder);
//       if (error) {
//         throw new Error(`Validation failed: ${error.details?.[0]?.message || error.message}`);

//       }

//       // Check if variant exists and has sufficient stock
//       const variant = await variantSchema.findOne({
//         _id: singleOrder.variantId,
//       });

//       if (!variant) {
//         throw new Error(`Variant not found for ID: ${singleOrder.variantId}`);
//       }

//       if (singleOrder.quantity > variant.stock) {
//         throw new Error(
//           `Requested quantity (${singleOrder.quantity}) exceeds available stock (${variant.stock}) for product: ${variant.name || variant._id}`
//         );
//       }

//       // Store validation result for later processing
//       stockValidationResults.push({
//         orderData: singleOrder,
//         variant,
//         isValid: true
//       });

//     } catch (error) {
//       stockValidationResults.push({
//         orderData: singleOrder,
//         isValid: false,
//         error: error.message
//       });
//       failedOrders.push({
//         orderIndex: index,
//         error: error.message
//       });
//     }
//   }

//   // If any validation failed, return early without processing any orders
//   if (failedOrders.length > 0) {
//     return NextResponse.json(
//       {
//         isSuccess: false,
//         message: "Stock validation failed for some items",
//         failedOrders: failedOrders
//       },
//       { status: 400 }
//     );
//   }

//   // Process only validated orders
//   for (const [index, validationResult] of stockValidationResults.entries()) {
//     const { orderData, variant } = validationResult;

//     try {
//       // Calculate total
//       const subtotal = orderData.price * orderData.quantity;
//       const total = subtotal + (orderData.deliveryFee || 0) + (orderData.tax || 0);

//       // Create order
//       const createdOrder = await orderSchema.create({
//         ...orderData,
//         total,
//         user: userId,
//         status: "Pending",
//         cancel: 0
//       });

//       // Update stock with atomic operation to prevent race conditions
//       const updatedVariant = await variantSchema.findOneAndUpdate(
//         {
//           _id: orderData.variantId,
//           stock: { $gte: orderData.quantity } // Ensure stock hasn't changed
//         },
//         {
//           $inc: { stock: -orderData.quantity },
//         },
//         { new: true }
//       );

//       if (!updatedVariant) {
//         // Rollback order creation if stock update fails
//         await orderSchema.findByIdAndDelete(createdOrder._id);
//         throw new Error(
//           `Failed to update stock for variant ID: ${orderData.variantId}. Stock may have been modified by another process.`
//         );
//       }

//       // Create tracking entry
//       const trackingData = trackOrder(createdOrder);
//       await trackOrderSchema.create(trackingData);

//       createdOrders.push(createdOrder);

//     } catch (error) {
//       failedOrders.push({
//         orderIndex: index,
//         error: error.message
//       });

//       // Optional: You might want to stop processing further orders if one fails
//       // break; // Uncomment if you want to stop on first failure
//     }
//   }

//   // Prepare response
//   const response = {
//     isSuccess: failedOrders.length === 0,
//     totalOrders: body.length,
//     createdCount: createdOrders.length,
//     failedCount: failedOrders.length,
//   };

//   if (failedOrders.length > 0) {
//     response.failedOrders = failedOrders;
//     return NextResponse.json(
//       {
//         isSuccess: false,
//         message: "Some orders failed to process",
//         ...response
//       },
//       { status: 207 } // 207 Multi-Status for partial success
//     );
//   }

//   return NextResponse.json({
//     isSuccess: true,
//     message: "Your order has been placed successfully!",
//     data: createdOrders
//   });
// });

// const productName = await productSchema
//   .findById(singleOrder.productId)
//   .select("title");
// console.log("productName======", productName);

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
      // Validate order data
      const { error } = validate(addSOrderValidation, singleOrder);
      if (error) {
        return NextResponse.json(
          { isSuccess: false, message: error },
          { status: 400 }
        );
      }

      // Check variant existence
      const variant = await variantSchema.findById(singleOrder.variantId);
      if (!variant) {
        throw new Error("Variant not found");
      }

      // Fetch product details for this variant
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

      console.log("productDetails====", productDetails);

      // Stock validation
      if (variant.stock < singleOrder.quantity) {
        failedOrders.push({
          variantId: variant._id,
          message: `Only ${variant.stock} units of ${productDetails?.productName} (${productDetails?.colorName}, ${productDetails?.sizeName}) are available, but you requested ${singleOrder.quantity}.`,
        });
        continue;
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

      console.log("addressDetails=============13========", singleOrder);

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
      console.log("error=========", error);

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
      // Require orderId for updates
      if (!orderData._id) {
        failedOrders.push({
          message: "Order ID (_id) is required for updating.",
        });
        continue;
      }

      // Attach user
      const singleOrder = {
        ...orderData,
        user: userId,
      };

      // Validate input
      const { error } = validate(updateOrderValidation, singleOrder);
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

      // If variantId/quantity is updated, validate stock
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
      console.log("Update error ====", error);
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

// export const POST = asyncHandler(async (request) => {
//   const decodedUser = await userAuthentication(request);
//   const userId = decodedUser.id;
//   const body = await request.json();

//   // Validate input format
//   if (!Array.isArray(body) || body.length === 0) {
//     return NextResponse.json(
//       {
//         isSuccess: false,
//         message: "Input must be a non-empty array of orders.",
//       },
//       { status: 400 }
//     );
//   }

//   const createdOrders = [];
//   const failedOrders = [];

//   // Process each order sequentially
//   for (const [index, orderData] of body.entries()) {
//     const singleOrder = {
//       ...orderData,
//       user: userId,
//       status: "Pending",
//       cancel: 0,
//     };

//     try {
//       const { error } = validate(addSOrderValidation, singleOrder);
//       if (error) {
//         return NextResponse.json({message: error, isSuccess: false }, { status: 400 });
//       }
//       // Create order in DB
//       const subtotal = singleOrder.price * singleOrder.quantity;
//       singleOrder.total =
//         subtotal + (singleOrder.deliveryFee || 0) + (singleOrder.tax || 0);
//       const createdOrder = await orderSchema.create(singleOrder);
//       if (createdOrder) {
//         // Inside the for loop (replace your variant update block)

//         const variant = await variantSchema.findOne({
//           _id: singleOrder.variantId,
//         });

//         if (!variant) {
//           throw new Error(`Variant not found for ID: ${singleOrder.variantId}`);
//         }

//         // All good: create order
//         const subtotal = singleOrder.price * singleOrder.quantity;
//         singleOrder.total =
//           subtotal + (singleOrder.deliveryFee || 0) + (singleOrder.tax || 0);

//         const createdOrder = await orderSchema.create(singleOrder);

//         // Update stock
//         const updatedVariant = await variantSchema.findOneAndUpdate(
//           {
//             _id: singleOrder.variantId,
//             stock: { $gte: singleOrder.quantity },
//           },
//           {
//             $inc: { stock: -singleOrder.quantity },
//           },
//           { new: true }
//         );

//         if (!updatedVariant) {
//           await orderSchema.findByIdAndDelete(createdOrder._id);
//           throw new Error(
//             `Failed to update stock. Possible concurrency issue for variant ID: ${singleOrder.variantId}`
//           );
//         }

//         // Create tracking entry
//         const trackingData = trackOrder(createdOrder);
//         await trackOrderSchema.create(trackingData);
//       }
//       createdOrders.push(createdOrder);
//     } catch (error) {
//       failedOrders.push({
//         // orderIndex: index,
//         // orderData: singleOrder,
//         message: error.message.message || "Something went wrong",
//       });
//     }
//   }

//   // Prepare response
//   const response = {
//     isSuccess: failedOrders.length === 0,
//     totalOrders: body.length,
//     createdCount: createdOrders.length,
//     failedCount: failedOrders.length,
//   };

//   // Only include failed orders if there are any
//   if (failedOrders.length > 0) {
//     response.failedOrders = failedOrders;
//     return NextResponse.json({ isSuccess: false, message: response });
//   }

//   return NextResponse.json({
//     isSuccess: true,
//     message: "Your order has been placed successfully!",
//   });
// });

// Cancel

// export const PUT = asyncHandler(async (request) => {
//   const decodedUser = await userAuthentication(request);
//   const userId = decodedUser.id;
//   const body = await request.json();
//   const findOrder = await orderSchema.findOne({
//     user: userId,
//     _id: body._id,
//     cancel: 0,
//   });

//   if (!findOrder) {
//     return NextResponse.json({
//       isSuccess: false,
//       message: "Order not found",
//     });
//   }
//   const result = await orderSchema.updateOne(
//     { user: userId, _id: body._id },
//     {
//       $set: {
//         cancel: 1,
//         cancelReason: body.cancelReason,
//       },
//     }
//   );
//   if (result) {
//     return NextResponse.json({
//       isSuccess: false,
//       message: "Your order has been cancelled successfully!",
//     });
//   }
// });

// Get Orders

export const GET = asyncHandler(async (request) => {
  const decodedUser = await userAuthentication(request);
  const userId = decodedUser.id;

  // Get search params from the request URL
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || "Pending";
  console.log("status=========", status);
  const matchStage =
    status === "Cancelled"
      ? { user: new mongoose.Types.ObjectId(userId), cancel: 1 }
      : { user: new mongoose.Types.ObjectId(userId), status, cancel: 0 };

  console.log(matchStage);

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

    // Sort newest first
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

// export const GET = asyncHandler(async (request) => {
//   const decodedUser = await userAuthentication(request);
//   const userId = decodedUser.id;

//   const resultData = await orderSchema.aggregate([
//     {
//       $match: {
//         user: new mongoose.Types.ObjectId(userId),
//         // status: { $ne: "Delivered" },
//         // cancel: 0,
//       },
//     },

//     // Lookup variant
//     {
//       $lookup: {
//         from: "variants",
//         localField: "variantId",
//         foreignField: "_id",
//         as: "variant",
//       },
//     },
//     { $unwind: { path: "$variant", preserveNullAndEmptyArrays: true } },

//     // Lookup size
//     {
//       $lookup: {
//         from: "sizes",
//         localField: "variant.size",
//         foreignField: "_id",
//         as: "size",
//       },
//     },
//     { $unwind: { path: "$size", preserveNullAndEmptyArrays: true } },

//     // Lookup color
//     {
//       $lookup: {
//         from: "colors",
//         localField: "variant.color",
//         foreignField: "_id",
//         as: "color",
//       },
//     },
//     { $unwind: { path: "$color", preserveNullAndEmptyArrays: true } },

//     // Lookup product
//     {
//       $lookup: {
//         from: "products",
//         localField: "variant.productId",
//         foreignField: "_id",
//         as: "product",
//       },
//     },
//     { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },

//     {
//       $project: {
//         _id: 0,
//         order_id: "$orderId",
//         product_name: "$product.title",
//         color: "$color.name",
//         quantity: 1,
//         size: "$size.size",
//         price: "$price",
//         itemTotal: { $multiply: ["$quantity", "$price"] },
//         orderCreated: "$createdAt",
//         image: { $arrayElemAt: ["$product.images", 0] },
//       },
//     },

//     // Sort newest first
//     // image: genratePublicUrl(item?.image),

//     {
//       $sort: { orderCreated: -1 },
//     },
//   ]);

//   const data = resultData.map((item) => {
//     return {
//       ...item,
//       image: genratePublicUrl(SAVE_PRODUCT_PATH, item?.image),
//     };
//   });

//   return NextResponse.json({
//     isSuccess: true,
//     message: "Orders fetched successfully!",
//     data: data,
//   });
// });
