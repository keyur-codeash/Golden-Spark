"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CgCloseR } from "react-icons/cg";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoMdHeartEmpty } from "react-icons/io";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";

const ProductDetails = ({ product, isOpen, setIsOpen }) => {
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("Gold");
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // Sample product data
  const productData = {
    id: 1,
    name: "Stone Pointed Toe Rings",
    price: 578,
    description:
      "Cheer on your favorite red and white team in eye-popping style with these red & white striped game bib overalls! Each pair is made of 100 percent cotton for a comfortable, breathable fit regardless of the weather and includes...",
    image: "/images/product_view_model_bg.png",
  };

  const sizes = ["S", "M", "L"];
  const colors = ["Gold", "Silver"];

  // Handle quantity changes
  const increaseQuantity = () => setQuantity((prev) => prev + 1);
  const decreaseQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  // Prevent body scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const onClose = () => {
    setIsOpen(false);
  };

  // Handle click outside modal
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black-200 bg-opacity-50"
      onClick={handleOverlayClick}
    >
      <div className="relative bg-white rounded-lg w-full max-w-6xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-10 cursor-pointer right-4 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <CgCloseR size={26} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Product Image */}
          <div className="w-full md:w-2/5">
            <div className="relative h-64 md:h-full">
              <Image
                src={productData.image}
                alt={productData.name}
                fill
                className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                priority
              />
            </div>
          </div>

          {/* Product Details */}
          <div className="w-full md:w-3/5 p-6 md:p-8 xl:px-12">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl sm:text-2xl lg:pt-15 ">
                  {productData.name}
                </h3>
                <p className="text-xl font-medium text-gray-900 my-2">
                  ${productData.price}
                </p>
              </div>
              <div className="bg-yellow-400">
                <button
                  onClick={onClose}
                  className="absolute top-3 sm:top-10 cursor-pointer right-4 rounded-sm bg-yellow-400  p-2 sm:p-0 text-gray-500 hover:text-gray-700"
                  aria-label="Close modal"
                >
                  <CgCloseR size={26} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 mb-6">{productData.description}</p>
            {/* Size Selection */}
            <div className="mb-6">
              <h4 className="font-medium text-lg mb-2">Size</h4>
              <div className="flex gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-6 py-1 text-lg border cursor-pointer rounded-md font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-yellow-800 text-white border-yellow-800"
                        : "border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Color and Quantity */}
            <div className="flex flex-col sm:flex-row gap-6 mb-6">
              <div>
                <h4 className="font-medium text-lg mb-2">Colours</h4>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-1 border cursor-pointer rounded-md text-lg font-medium transition-colors ${
                        selectedColor === color
                          ? "bg-yellow-800 text-white border-yellow-800"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector */}
              <div>
                <h4 className="font-medium text-lg mb-2">Quantity</h4>
                <div className="inline-flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 disabled:opacity-50 cursor-pointer "
                    aria-label="Decrease quantity"
                  >
                    <FiMinus size={18} />
                  </button>
                  <span className="w-12 text-center text-lg font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={increaseQuantity}
                    className="px-3 py-2 text-gray-600 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sm:flex">
              <div className="sm:pe-5 pb-5 sm:pb-0">
                <Button
                  icon={<IoMdHeartEmpty size={24} className="me-2" />}
                  type="submit"
                  label="ADD TO WISHLIST"
                  color="primary"
                  size="lg"
                  variant="solid"
                  className="bg-brown-900 w-full sm:w-auto !py-2.5 sm:!py-3 font-medium"
                  onClick={() => router.push("/")}
                />
              </div>
              <div>
                <Button
                  type="submit"
                  label="ADD TO CART"
                  color="primary"
                  size="lg"
                  variant="solid"
                  className="!bg-yellow-800  w-full sm:w-auto !py-2.5 sm:!py-3 font-medium"
                  onClick={() => router.push("your-cart")}
                />
              </div>
            </div>
            <div className="my-4">
              <Button
                label="BUY NOW"
                color="primary"
                size="lg"
                variant="solid"
                className="w-full !py-2.5 sm:!py-3 font-medium !bg-yellow-800 text-white hover:bg-yellow-900"
                onClick={() => router.push("check-out")}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
