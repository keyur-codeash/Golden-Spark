"use client";
import React, { useState, useEffect } from "react";
import { CgClose, CgCloseR } from "react-icons/cg";
import { FiMinus, FiPlus } from "react-icons/fi";
import Image from "next/image";
import Button from "@/components/Button";
import Link from "next/link";
import { HiArrowSmallRight } from "react-icons/hi2";

const EditCartItemModal = ({ item, isOpen, onClose, onUpdate, onRemove }) => {
  // State management
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("Gold");
  const [selectedSize, setSelectedSize] = useState("M");
  const sizes = ["S", "M", "L"];

  // Sync state with item prop changes
  useEffect(() => {
    if (item) {
      setQuantity(item.quantity || 1);
      setColor(item.color || "Gold");
      setSelectedSize(item.size || "M");
    }
  }, [item]);

  // Quantity handlers
  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Update handler
  const handleUpdate = () => {
    if (!item?.id) return;
    onUpdate({
      ...item,
      quantity,
      color,
      size: selectedSize,
    });
    onClose();
  };

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center  h-screen p-4">
      <div className="relative w-full max-w-xl rounded-sm border bg-white opacity-100 p-10 shadow-xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-10 top-10 cursor-pointer text-gray-500 transition-colors hover:text-gray-700"
          aria-label="Close modal"
        >
          <CgCloseR size={24} />
        </button>

        {/* Product Header */}
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row">
          {/* Product Image */}
          <div className="flex items-center gap-4">
            <div className="relative h-40 w-full shrink-0 sm:h-40 sm:w-40">
              <Image
                src={item.img || "/images/placeholder-product.png"}
                alt={item.heading || "Product"}
                fill
                className="rounded-md object-cover"
                sizes="(max-width: 640px) 100vw, 128px"
                priority
              />
            </div>

            {/* Product Info */}
            <div className="flex-1">
              <h2 className="text-xl text-gray-900">{item.heading}</h2>
              <p className="mt-1 text-lg font-medium text-gray-800">
                ${item.price?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-between gap-6 md:flex-row">
          {/* Left Column */}
          <div>
            {/* Color Selection */}
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-medium text-gray-800">
                Colours
              </h3>
              <div className="flex gap-3">
                {["Gold", "Silver"].map((colorOption) => (
                  <button
                    key={colorOption}
                    type="button"
                    onClick={() => setColor(colorOption)}
                    className={`cursor-pointer rounded-md border px-3 py-1.5 text-center font-medium transition-colors ${
                      color === colorOption
                        ? colorOption === "Gold"
                          ? "border-yellow-600 bg-yellow-600 text-white"
                          : "border-gray-400 bg-gray-400 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {colorOption}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center justify-center">
              <h3 className="pe-2 text-lg font-medium text-gray-800">
                Quantity:
              </h3>
              <div className="inline-flex cursor-pointer items-center rounded-md border border-gray-300">
                <button
                  onClick={decrementQuantity}
                  className="px-3 py-2 text-gray-600 disabled:opacity-5 cursor-pointer"
                  aria-label="Decrease quantity"
                >
                  <FiMinus
                    size={18}
                    className={quantity <= 1 && "text-gray-300"}
                  />
                </button>
                <span className="w-6 text-center text-lg font-medium">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="px-3 py-2 text-gray-600 cursor-pointer"
                  aria-label="Increase quantity"
                >
                  <FiPlus size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            {/* Size Selection */}
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-medium text-gray-800">Size</h3>
              <div className="flex gap-3">
                {sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`cursor-pointer rounded-md border px-6 py-1.5 text-center font-medium transition-colors ${
                      selectedSize === size
                        ? "border-yellow-600 bg-yellow-600 text-white"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className="mt-5">
              <Button
                label="ADD TO CART"
                color="blue"
                size="md"
                variant="solid"
                className="!cursor-pointer !bg-yellow-800 !rounded-0 py-3 flex items-center gap-[10px]"
                onClick={handleUpdate}
              />
            </div>
          </div>
        </div>

        {/* View Full Details Link */}
        <div className="flex justify-center pt-6">
          <Link
            href={`/product/${item.id || "14"}`}
            className="mt-4 flex cursor-pointer items-center gap-2 text-xl"
          >
            View Full Details <HiArrowSmallRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default EditCartItemModal;
