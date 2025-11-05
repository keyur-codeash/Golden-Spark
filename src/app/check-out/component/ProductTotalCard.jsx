"use client";
import Button from "@/components/Button";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useRouter, useParams } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";
import { fetchDeliveryDetails } from "@/forntend/services/deliveryServices";
import { useAddtocart } from "@/forntend/context/AddToCartContext";

const ProductTotalCard = ({
  loading,
  addresses = false,
  navigate,
  onclick,
  isPaymnetUI = false,
  btntext = "PLACE ORDER",
  orderErrors = [],
}) => {
  const {
    addtocartlist,
    updateCartItemQuantity,
    removeFromaddtocart,
    updateCartItemVariant,
    setError,
  } = useAddtocart();
  const { addressId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [localError, setLocalError] = useState("");
  const router = useRouter();

  const deliveryFee = delivery?.delivery || 0;
  const taxRate = delivery?.tax || 0;

  // Totals
  const subtotal = addtocartlist.reduce(
    (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
    0
  );
  const taxAmount = (subtotal * taxRate) / 100;
  const total = subtotal + deliveryFee + taxAmount;

  // Quantity
  const handleQuantityChange = (productVariantId, newQuantity) => {
    if (newQuantity > 0) {
      updateCartItemQuantity(productVariantId, newQuantity);
    }
  };

  // Place  Order
  const handlePlaceOrder = () => {
    if (onclick) {
      const orderPayload = addtocartlist.map((product) => ({
        addressId: addressId,
        deliveryFee,
        paymentMethod: "Cash",
        price: product.price || 0,
        productId: product.id,
        quantity: product.quantity,
        tax: taxRate,
        variantId: product.selectedVariant?.id || product.productVariantId,
      }));
      onclick(orderPayload);
    } else {
      router.push(navigate ? navigate : "/payment");
    }
  };

  // Size change
  const handleSizeChange = (product, sizeId) => {
    const currentColor = product?.selectedVariant?.color;
    const exactVariant = product.allVariants.find(
      (variant) => variant.size === sizeId && variant.color === currentColor
    );

    if (exactVariant) {
      updateCartItemVariant(product.productVariantId, currentColor, sizeId);
      setLocalError("");
      setError(null);
    } else {
      setLocalError("This color and size combination is not available");
      setError("This color and size combination is not available");
    }
  };

  // Available sizes
  const getAvailableSizesForSelectedColor = (product) => {
    if (!product.allVariants || !product.selectedVariant) return [];
    const selectedColor = product.selectedVariant.color;
    const sizeMap = new Map();

    product.allVariants.forEach((variant) => {
      if (variant.color === selectedColor) {
        const sizeInfo = product.availableSizes.find(
          (size) => size.id === variant.size
        );
        if (sizeInfo) {
          sizeMap.set(variant.size, {
            id: variant.size,
            name: sizeInfo.name,
            variantId: variant.id,
            stock: variant.stock || 0,
          });
        }
      }
    });

    return Array.from(sizeMap.values());
  };

  // Delivery
  useEffect(() => {
    const fetchDetails = async () => {
      const response = await fetchDeliveryDetails();
      if (response?.isSuccess) {
        setDelivery(response.data[0]);
      }
    };
    fetchDetails();
  }, []);

  // Helper function to extract stock number from error message
  const extractStockFromMessage = (message) => {
    const stockMatch = message?.match(/(\d+)/);
    return stockMatch ? parseInt(stockMatch[1]) : null;
  };

  //  Enhanced error mapping with stock-specific handling
  const errorMap = orderErrors.reduce((acc, err) => {
    acc[err.variantId] = {
      message: err.message,
      type: err.message?.toLowerCase().includes("stock") ? "stock" : "general",
      availableStock: extractStockFromMessage(err.message),
    };
    return acc;
  }, {});

  // Check if product has stock error
  const hasStockError = (product) => {
    const productError =
      errorMap[product.selectedVariant?.id] ||
      errorMap[product.productVariantId];
    return productError?.type === "stock";
  };

  // Get available stock for product
  const getAvailableStock = (product) => {
    const productError =
      errorMap[product.selectedVariant?.id] ||
      errorMap[product.productVariantId];
    return productError?.availableStock || product.selectedVariant?.stock || 0;
  };

  // Check if any product has stock error
  const hasAnyStockError = addtocartlist.some((product) =>
    hasStockError(product)
  );

  console.log(localError);

  if (loading) {
    return (
      <div className="lg:me-4 select-none border-2 border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
        Loading...
      </div>
    );
  }

  return (
    <div className="lg:me-4 select-none border-2 border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
      {isPaymnetUI && (
        <div>
          <div className="bg-black hidden sm:block text-white p-4 text-2xl">
            Cart View
          </div>
          <div className="px-4 sm:px-9 pb-4 pt-7 sm:pt-12">
            <Button
              icon={<HiOutlineArrowLeft size={24} className="me-2" />}
              label="Back TO CART"
              variant="outline"
              className="px-3 py-3 w-full border !text-black border-black"
              onClick={() => router.push("/your-cart")}
            />
          </div>
        </div>
      )}

      {/* Global Stock Error Banner */}
      {hasAnyStockError && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-4 mt-4 rounded">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Some items in your cart have insufficient stock. Please update
                quantities to proceed.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="p-4 lg:pt-10">
        <div className="md:px-4 md:pb-4 2xl:px-6 2xl:pb-0">
          {addtocartlist.length > 0 ? (
            addtocartlist.map((product) => {
              const availableSizes = getAvailableSizesForSelectedColor(product);
              const productError =
                errorMap[product.selectedVariant?.id] ||
                errorMap[product.productVariantId];
              const isStockError = productError?.type === "stock";
              const availableStock = getAvailableStock(product);

              return (
                <div className=" pb-4  mb-6 border-b">
                  <div
                    key={product.productVariantId}
                    className={`sm:flex justify-betweenrelative ${
                      isStockError
                        ? "bg-red-50 border-red-200 rounded-lg p-4 pb-0 -mx-2"
                        : ""
                    }`}
                  >
                    {/* Stock Error Badge */}
                    {isStockError && (
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                        Low Stock
                      </div>
                    )}

                    {/* Image */}
                    <div className="md:w-1/2 lg:w-[40%] xl:w-[40%] 2xl:w-[50%] sm:pe-8 lg:pe-4">
                      <div className="relative w-full md:w-full md:h-[200px] lg:h-[150px] sm:w-[170px]  mx-auto xl:w-[150px] xl:h-[150px] 2xl:w-full 2xl:pe-10 2xl:h-[200px] h-[170px]">
                        <Image
                          src={product.images?.[0] || "/images/placeholder.jpg"}
                          alt={product.title}
                          fill
                          className={`object-center w-full rounded-md ${
                            isStockError ? "opacity-80" : ""
                          }`}
                        />
                        {isStockError && (
                          <div className="absolute inset-0 bg-red-100 bg-opacity-20 rounded-md"></div>
                        )}
                      </div>
                    </div>

                    {/* Details */}
                    <div className="md:w-1/2 lg:w-[60%] xl:w-[60%] 2xl:w-[50%]">
                      <div
                        className={`text-xl pt-5 sm:p-0 ${
                          isStockError ? "text-red-800" : ""
                        }`}
                      >
                        {product.title}
                      </div>

                      {/* Stock Information */}
                      {isStockError && (
                        <div className="mt-2 bg-red-100 border border-red-200 rounded-md p-2">
                          <p className="text-red-700 text-sm font-medium">
                            Only {availableStock} item(s) available
                          </p>
                          <p className="text-red-600 text-xs mt-1">
                            Please reduce quantity to {availableStock} or choose
                            a different variant
                          </p>
                        </div>
                      )}

                      {/* Quantity */}
                      <div className="flex items-center mt-3">
                        <p className="text-xl pe-5">Quantity:</p>
                        <div>
                          <div
                            className={`flex justify-center w-30 rounded-md items-center py-1 border px-2 ${
                              isStockError ? "border-red-300 bg-red-50" : ""
                            }`}
                          >
                            <button
                              className="text-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() =>
                                handleQuantityChange(
                                  product.productVariantId,
                                  product.quantity - 1
                                )
                              }
                              disabled={product.quantity <= 1}
                            >
                              <FiMinus />
                            </button>
                            <p
                              className={`px-4 text-xl ${
                                isStockError ? "text-red-600 font-semibold" : ""
                              }`}
                            >
                              {product.quantity}
                              {isStockError && (
                                <span className="text-red-500 text-sm ml-1">
                                  (max: {availableStock})
                                </span>
                              )}
                            </p>
                            <button
                              className="text-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                              onClick={() =>
                                handleQuantityChange(
                                  product.productVariantId,
                                  product.quantity + 1
                                )
                              }
                              disabled={
                                isStockError &&
                                product.quantity >= availableStock
                              }
                            >
                              <FiPlus />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Size Selector */}
                      {availableSizes.length > 0 && (
                        <div className="mt-4">
                          <h3 className="text-lg xl:text-xl text-gray-700 mb-3">
                            Size
                          </h3>
                          <div className="flex space-x-3 flex-wrap gap-y-3">
                            {availableSizes?.map((size) => (
                              <button
                                key={size.id}
                                onClick={() =>
                                  handleSizeChange(product, size.id)
                                }
                                className={`px-5 py-1.5 text-sm rounded-md cursor-pointer transition-all ${
                                  product.selectedVariant.size === size.id
                                    ? "bg-yellow-800 text-white"
                                    : "border border-gray-300 text-gray-800 hover:border-gray-400"
                                } ${
                                  size.stock === 0
                                    ? "opacity-50 cursor-not-allowed grayscale"
                                    : ""
                                }`}
                                disabled={size.stock === 0}
                                title={size.stock === 0 ? "Out of stock" : ""}
                              >
                                {size.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Price */}
                      <div className="text-xl flex items-center justify-between py-4">
                        <p className={isStockError ? "text-red-700" : ""}>
                          Price :
                        </p>
                        <p className={isStockError ? "text-red-700" : ""}>
                          ${(product.price || 0).toFixed(2)}
                          {isStockError && (
                            <span className="text-red-500 text-sm line-through ml-1">
                              $
                              {(
                                (product.price || 0) * product.quantity
                              ).toFixed(2)}
                            </span>
                          )}
                        </p>
                      </div>

                      {/* Suggested Action for Stock Error */}
                      {isStockError && (
                        <div className="mt-2 flex space-x-2">
                          <button
                            onClick={() =>
                              handleQuantityChange(
                                product.productVariantId,
                                availableStock
                              )
                            }
                            className="text-xs bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                          >
                            Set to {availableStock}
                          </button>
                          <button
                            onClick={() =>
                              removeFromaddtocart(product.productVariantId)
                            }
                            className="text-xs bg-gray-500 text-white px-3 py-1 rounded hover:bg-gray-600 transition-colors"
                          >
                            Remove Item
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    {console.log(localError, "abc", productError)}
                    {(localError || productError) && !isStockError && (
                      <p className="text-red-600 text-sm mt-2 bg-red-50 p-2 rounded border border-red-200">
                        {localError || productError.message}
                      </p>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10">
              <p className="text-xl">Your cart is empty</p>
              <Button
                label="Continue Shopping"
                className="mt-4"
                onClick={() => router.push("/")}
              />
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        {addtocartlist.length > 0 && (
          <div className="mb-5 md:mx-6 md:mb-6">
            <div className="space-y-4 text-xl">
              <div className="flex justify-between">
                <span className="">Items</span>
                <span className="">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <p className="">Delivery</p>
                <span className="">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="">Tax ({taxRate}%)</span>
                <span className="">${taxAmount.toFixed(2)}</span>
              </div>
              <div
                className={`flex justify-between pt-4 border-t ${
                  hasAnyStockError ? "border-red-300" : "border-gray-200"
                }`}
              >
                <span
                  className={`text-lg font-bold ${
                    hasAnyStockError ? "text-red-700" : ""
                  }`}
                >
                  Total
                  {hasAnyStockError && (
                    <span className="text-red-500 text-sm font-normal block">
                      *Adjust quantities to proceed
                    </span>
                  )}
                </span>
                <span
                  className={`text-lg font-bold ${
                    hasAnyStockError ? "text-red-700" : ""
                  }`}
                >
                  ${total.toFixed(2)}
                </span>
              </div>
              {console.log(
                "localError.length",
                hasAnyStockError.length > 0,
                hasAnyStockError
              )}
              <div>
                <Button
                  label={
                    hasAnyStockError
                      ? "FIX STOCK ISSUES TO PLACE ORDER"
                      : btntext
                  }
                  size="md"
                  variant="solid"
                  className={`w-full !rounded-0 py:3 sm:py-3.5 mt-3 flex items-center gap-[10px] ${
                    hasAnyStockError
                      ? "!bg-red-500 hover:!bg-red-600 cursor-not-allowed"
                      : "!bg-yellow-800 hover:!bg-yellow-900"
                  }`}
                  onClick={handlePlaceOrder}
                  disabled={hasAnyStockError.length > 0 || hasAnyStockError}
                />
                {hasAnyStockError && (
                  <p className="text-red-600 text-sm mt-2 text-center">
                    Please resolve all stock issues before placing your order
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductTotalCard;
