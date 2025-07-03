// import { productDetails } from "@/data/data";
// import ProductClient from "./component/ProductClient";

// // Static export: define all product params
// export async function generateStaticParams() {
//   return productDetails.map((product) => ({
//     product: product.slug || product.id || "1", // Change as needed
//   }));
// }

// export default function Page({ params }) {
//   const { product } = params;

//   return <ProductClient product={product} />;
// }
"use client";
import { useState, useEffect } from "react";
import {
  accordionData,
  productAccoudianData,
  productDetails,
} from "@/data/data";
import Image from "next/image";
import { HiOutlineX, HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { FiMinus, FiPlus, FiHeart } from "react-icons/fi";
import Button from "@/components/Button";
import Accordion from "@/components/Accordion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import SupremeQuality from "../components/SupremeQuality";
import YouMightAlsoLike from "../components/YouMightAlsoLike";
import { redirect } from "next/navigation";

const filterOptions = {
  sizes: ["S", "M", "L"],
};

function page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState(null);
  const [color, setColor] = useState("Gold");
  const [quantity, setQuantity] = useState(0);

  const visibleImages = productDetails.slice(0, 5);
  const remainingCount = productDetails.length - 5;

  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  const openModal = (index = 0) => {
    setCurrentImageIndex(index);
    setIsModalOpen(true);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? productDetails.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productDetails.length - 1 ? 0 : prev + 1
    );
  };

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-2 mt-4">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-[16px] h-[16px] rounded-full bg-white"></div>
    ),
  };

  return (
    <>
      <div className="container mx-auto py-6 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Desktop Image Grid */}
          <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
            {visibleImages.map((item, index) => (
              <div
                key={index}
                className="relative w-full h-[200px] sm:h-[300px] cursor-pointer"
                onClick={() => openModal(index)}
              >
                <Image
                  src={item.image}
                  alt={`image-${index}`}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
            {remainingCount > 0 && (
              <div
                onClick={() => openModal(5)}
                className="relative w-full h-[200px] sm:h-[300px] bg-black/50 rounded-lg cursor-pointer flex items-center justify-center text-white text-2xl font-bold"
              >
                +{remainingCount}
              </div>
            )}
          </div>

          {/* Mobile Slider */}
          <div className="lg:hidden">
            <Slider {...sliderSettings}>
              {productDetails.map((item, index) => (
                <div
                  key={index}
                  className="relative w-full h-[300px] cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  <Image
                    src={item.image}
                    alt={`image-${index}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                </div>
              ))}
            </Slider>
          </div>

          {/* Product Info */}
          <div className="space-y-4">
            <h2 className="text-2xl ">Stone Pointed Toe Rings</h2>
            <p className="text-xl font-bold">$580</p>
            <p className="text-gray-700">
              Cheer on your favorite red and white team in eye-popping style
              with these red & white striped game bib overalls! Each pair is
              made of 100% cotton for a breathable fit in all weather...
            </p>

            <div>
              <p className="text-xl font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {filterOptions.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => handleSizeSelect(size)}
                    className={`px-4 py-1 border cursor-pointer rounded-md text-lg font-medium transition ${
                      selectedSize === size
                        ? "bg-yellow-800 text-white border-yellow-800"
                        : "text-gray-800"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              <div className="flex justify-start items-center">
                <div>
                  <p className="text-xl font-medium mb-2 pt-4">Colors</p>
                  <button
                    onClick={() => setColor("Gold")}
                    className={`px-4 border cursor-pointer py-1 rounded-md text-lg font-medium transition ${
                      color === "Gold"
                        ? "bg-yellow-800 text-white border-yellow-800"
                        : "text-gray-800"
                    }`}
                  >
                    Gold
                  </button>
                  <button
                    onClick={() => setColor("Sliver")}
                    className={`px-4 border cursor-pointer py-1 mx-2 rounded-md text-lg font-medium transition ${
                      color === "Sliver"
                        ? "border-gray-400 bg-gray-400 text-white"
                        : "text-gray-800"
                    }`}
                  >
                    Sliver
                  </button>
                </div>
                <div className="sm:px-5">
                  <p className="text-xl font-medium mb-2 pt-4">Quantity:</p>
                  <div className="flex justify-center rounded-md items-center py-1 border px-3">
                    <p
                      className="text-xl cursor-pointer"
                      onClick={() => quantity > 0 && setQuantity(quantity - 1)}
                    >
                      <FiMinus />
                    </p>
                    <p className="px-4 text-xl">{quantity}</p>
                    <p
                      className="text-xl cursor-pointer"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <FiPlus />
                    </p>
                  </div>
                </div>
              </div>

              <div className="sm:flex items-center pt-7 pb-4">
                <Button
                  label="ADD TO WISHLIST"
                  icon={<FiHeart size={20} />}
                  size="lg"
                  variant="solid"
                  className="!bg-brown-900 w-full sm:w-auto !rounded-0 py:3 flex items-center gap-[10px]"
                  onClick={() => redirect("/wishlist")}
                />

                <Button
                  label="ADD TO CART"
                  size="lg"
                  variant="solid"
                  className="!bg-yellow-800 w-full sm:w-auto !rounded-0 mt-4 sm:mt-0 sm:mx-5 py:3 flex items-center gap-[10px]"
                  onClick={() => redirect("/your-cart")}
                />
              </div>
              <div>
                <Button
                  label="BUY NOW"
                  size="lg"
                  variant="solid"
                  className="!bg-yellow-800 w-full !rounded-0 py:3 flex items-center gap-[10px]"
                  onClick={() => redirect("/check-out")}
                />
              </div>
              <div className="pt-8">
                <Accordion accordionData={productAccoudianData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black-200 bg-opacity-90 flex items-center justify-center p-4 overflow-hidden">
          <div className="relative w-full bg-brown-500 max-w-6xl border-4 border-gray-600 p-5 sm:p-10 shadow-lg rounded-3xl overflow-hidden h-[70vh] sm:h-[80vh] flex flex-col">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute cursor-pointer top-5 right-5 text-black text-3xl z-50"
            >
              <HiOutlineX />
            </button>

            <div className="relative flex-1 w-full mb-4">
              <div className="relative w-full h-full">
                <Image
                  src={productDetails[currentImageIndex].image}
                  alt="main-image"
                  fill
                  className="object-contain rounded-lg"
                />
                <button
                  onClick={prevImage}
                  className="absolute cursor-pointer top-1/2 left-2 transform -translate-y-1/2 text-white bg-black p-2 rounded-full z-10"
                >
                  <HiChevronLeft size={25} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute cursor-pointer top-1/2 right-2 transform -translate-y-1/2 text-white bg-black p-2 rounded-full z-10"
                >
                  <HiChevronRight size={25} />
                </button>
              </div>
            </div>

            <div className="flex w-full overflow-x-auto gap-2 pb-2">
              {productDetails.map((item, index) => (
                <div
                  key={index}
                  className={`relative w-[150px] h-[100px] flex-shrink-0 cursor-pointer border-2 rounded ${
                    index === currentImageIndex
                      ? "border-black"
                      : "border-transparent"
                  }`}
                  onClick={() => setCurrentImageIndex(index)}
                >
                  <Image
                    src={item.image}
                    alt={`thumb-${index}`}
                    fill
                    className="object-cover rounded"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <SupremeQuality />
      <YouMightAlsoLike />
    </>
  );
}

export default page;
