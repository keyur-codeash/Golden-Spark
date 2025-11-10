"use client";
import React, { useState, useEffect } from "react";
import { CgCloseR } from "react-icons/cg";
import { FiMinus, FiPlus } from "react-icons/fi";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { HiArrowSmallRight } from "react-icons/hi2";
import { useAddtocart } from "@/forntend/context/AddToCartContext";

const EditCartItemModal = ({ item, isOpen, onClose, onUpdate, onRemove }) => {
  const { generateProductVariantId } = useAddtocart();

  // State management
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [error, setError] = useState("");
  const [availableSizesForColor, setAvailableSizesForColor] = useState([]);

  useEffect(() => {
    if (item) {
      setQuantity(item.quantity || 1);

      if (item.selectedVariant) {
        setSelectedColor(item.selectedVariant.color || "");
        setSelectedSize(item.selectedVariant.size || "");
      } else if (item.availableColors?.length > 0) {
        setSelectedColor(item.availableColors[0].id);
      }
    }
  }, [item]);

  // Update available sizes when color 
  useEffect(() => {
    if (selectedColor && item.allVariants) {
      const sizesForColor = [];
      const sizeMap = new Map();

      // Get all unique sizes available for the selected color
      item.allVariants.forEach((variant) => {
        if (
          variant.color === selectedColor &&
          variant.size &&
          !sizeMap.has(variant.size)
        ) {
          const sizeObj = item.availableSizes?.find(
            (s) => s.id === variant.size
          );
          if (sizeObj) {
            sizesForColor.push(sizeObj);
            sizeMap.set(variant.size, true);
          }
        }
      });

      setAvailableSizesForColor(sizesForColor);

      if (
        selectedSize &&
        !sizesForColor.some((size) => size.id === selectedSize)
      ) {
        setSelectedSize(sizesForColor[0]?.id || "");
      } else if (!selectedSize && sizesForColor.length > 0) {
        setSelectedSize(sizesForColor[0].id);
      }
    }
  }, [selectedColor, item.allVariants, item.availableSizes, selectedSize]);

  const checkVariantExists = (colorId, sizeId) => {
    return item.allVariants.some(
      (variant) => variant.color === colorId && variant.size === sizeId
    );
  };

  const getCurrentVariant = () => {
    return item.allVariants.find(
      (variant) =>
        variant.color === selectedColor && variant.size === selectedSize
    );
  };

  // Handle color selection
  const handleColorSelect = (colorId) => {
    setSelectedColor(colorId);
    setError("");

    if (selectedSize && !checkVariantExists(colorId, selectedSize)) {
      setError("This color and size combination is not available");
    }
  };

  // Handle size selection
  const handleSizeSelect = (sizeId) => {
    setSelectedSize(sizeId);
    setError("");

    if (selectedColor && !checkVariantExists(selectedColor, sizeId)) {
      setError("This color and size combination is not available");
    }
  };

  // Quantity handlers
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Update handler
  const handleUpdate = () => {
    if (!item?.id) return;

    // Validate selection
    if (!selectedColor) {
      setError("Please select a color");
      return;
    }

    // Check if the selected combination exists
    if (selectedSize && !checkVariantExists(selectedColor, selectedSize)) {
      setError("Please select a valid color and size combination");
      return;
    }

    const currentVariant = getCurrentVariant();

    // Create the variant object
    const variantToUse = currentVariant || {
      color: selectedColor,
      size: selectedSize,
      price: item.price,
      stock: item.stock,
    };

    const newProductVariantId = generateProductVariantId(item.id, variantToUse);

    const updatedItem = {
      ...item,
      quantity,
      selectedVariant: variantToUse,
      oldproductVariantId: item.productVariantId,
      productVariantId: newProductVariantId,
      price: variantToUse.price,
      stock: variantToUse.stock,
    };

    onUpdate(updatedItem);
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="mt-40">
      <div className=" absolute inset-0 flex items-center justify-center overflow-y-auto bg-white sm:fixed sm:h-screen sm:p-4 sm:bg-transparent">
        <div className="relative w-full max-w-xl sm:h-auto h-full rounded-sm border bg-white p-6 sm:p-8 shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-6 top-6 sm:right-10 sm:top-10 cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
            aria-label="Close modal"
          >
            <CgCloseR size={24} />
          </button>

          {/* Product Header */}
          <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:mt-0">
            <div className="sm:flex items-center gap-4">
              <div className="relative h-40 w-full sm:h-40 sm:w-40 shrink-0">
                <Image
                  src={item.images[0] || "/images/placeholder-product.png"}
                  alt={item.title || "Product"}
                  fill
                  className="rounded-md object-cover"
                  sizes="(max-width: 640px) 100vw, 128px"
                  priority
                />
              </div>

              <div className="flex-1">
                <h2 className="text-xl text-gray-900">{item.title}</h2>
                <p className="mt-1 text-lg font-medium text-gray-800">
                  $
                  {(
                    getCurrentVariant()?.price ||
                    item.selectedVariant?.price ||
                    item.price
                  )?.toFixed(2) || "0.00"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 sm:flex-row justify-between">
            <div className="flex-1">
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-medium text-gray-800">
                  Colours
                </h3>
                <div className="flex gap-3 flex-wrap">
                  {item.availableColors?.map((color) => {
                    const isSelected = selectedColor === color.id;
                    return (
                      <button
                        key={color.id}
                        type="button"
                        onClick={() => handleColorSelect(color.id)}
                        style={{
                          backgroundColor: isSelected
                            ? color.color
                            : "transparent",
                          border: `1px solid ${
                            isSelected ? color.color : "#000"
                          }`,
                          color: isSelected ? "#fff" : "#000",
                        }}
                        className={`px-4 py-1 cursor-pointer rounded-md text-lg font-medium transition`}
                      >
                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6 flex items-center">
                <h3 className="pe-2 text-lg font-medium text-gray-800">
                  Quantity:
                </h3>
                <div className="inline-flex items-center rounded-md border border-gray-300">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 disabled:opacity-50"
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="w-6 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= process.env.NEXT_PUBLIC_MAX_QUANTITY}
                    className="px-3 py-2 text-gray-600"
                    aria-label="Increase quantity"
                  >
                    <FiPlus
                      size={18}
                      className={
                        quantity == process.env.NEXT_PUBLIC_MAX_QUANTITY
                          ? "text-gray-400"
                          : ""
                      }
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 sm:w-1/2">
              <div className="mt-6">
                <h3 className="mb-3 text-lg font-medium text-gray-800">Size</h3>
                <div className="flex gap-3 flex-wrap">
                  {item.availableSizes?.map((size) => (
                    <button
                      key={size.id}
                      type="button"
                      onClick={() => handleSizeSelect(size.id)}
                      className={`cursor-pointer rounded-md border px-6 py-1.5 text-center font-medium transition-colors ${
                        selectedSize === size.id
                          ? "border-yellow-600 bg-yellow-600 text-white"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-1.5 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
            <div className="w-full ">
              <Button
                label="UPDATE CART"
                color="blue"
                size="md"
                variant="solid"
                className="!cursor-pointer !bg-yellow-800 !rounded-0 py-3 flex items-center justify-center gap-[10px] w-full"
                onClick={handleUpdate}
              />
            </div>
          </div>

          <div className="flex justify-center pt-6">
            <Link
              href={`/product/${item.id}`}
              className="mt-2 flex cursor-pointer items-center gap-x-2 text-xl"
            >
              View Full Details <HiArrowSmallRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCartItemModal;