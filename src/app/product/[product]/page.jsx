"use client";
import { useState, useEffect } from "react";
import { accordionData, productAccoudianData } from "@/data/data";
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
import { redirect, useParams } from "next/navigation";
import { fetchSingleProduct } from "@/forntend/services/productService";
import { useWishlist } from "@/forntend/context/WishlistContext";
import { useRouter } from "next/navigation";
import useToken from "@/forntend/hooks/useToken";
import { useAddtocart } from "@/forntend/context/AddToCartContext";
import Loading from "@/components/Loading";
import {
  handleDecrementQuantity,
  handleIncrementQuantity,
} from "@/lib/handleQuantity";

const ProductDetailsPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const params = useParams();
  const router = useRouter();
  const { token } = useToken();
  const { addToWishlist } = useWishlist();
  const { addtocart } = useAddtocart();
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({
    title: "",
    brand: "",
    images: [],
    price: 0,
    description: "",
    isWishlist: false,
    selectedVariant: null,
    availableSizes: [],
    availableColors: [],
    allVariants: [],
  });

  const visibleImages = productDetails.images?.slice(0, 5) || [];
  const remainingCount = productDetails.images?.length - 5;

  const handleWishList = async () => {
    if (token) {
      if (!productDetails.isWishlist) {
        await addToWishlist(productDetails);
      }
      router.push("/wishlist");
    } else {
      router.push("/auth/sign-in");
    }
  };

  const getExactVariant = () => {
    if (!currentColor || !currentSize) return null;

    return productDetails.allVariants.find(
      (variant) =>
        variant.color === currentColor.id && variant.size === currentSize.id
    );
  };

  const handleAddToCart = async () => {
    if (!token) {
      router.push("/auth/sign-in");
      return;
    }

    if (!isValidCombination()) {
      setError("This color and size combination is not available");
      return;
    }
    const exactVariant = getExactVariant();

    if (exactVariant) {
      const response = await addtocart(productDetails.id, exactVariant);
      if (response) {
        router.push("/your-cart");
      }
    } else {
      setError("Please select a valid color and size combination");
    }
  };

  const isValidCombination = () => {
    if (!currentColor || !currentSize) return false;

    return productDetails.allVariants.some(
      (variant) =>
        variant.color === currentColor.id && variant.size === currentSize.id
    );
  };

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
      prev === 0 ? productDetails.images.length - 1 : prev - 1
    );
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === productDetails.images.length - 1 ? 0 : prev + 1
    );
  };

  const handleColorSelect = (colorId) => {
    const selectedColor = getColorById(colorId);
    if (!selectedColor) return;
    const partialVariant = {
      ...(selectedVariant || {}),
      color: colorId,
      size: currentSize ? currentSize.id : selectedVariant?.size || null,
    };

    console.log("product====", productDetails);

    console.log("hellow", partialVariant);

    setSelectedVariant(partialVariant);

    // If we have both color and size selected
    if (currentSize) {
      const exactVariant = productDetails.allVariants.find(
        (variant) =>
          variant.color === colorId && variant.size === currentSize.id
      );

      if (exactVariant) {
        setError("");
      } else {
        setError("This color and size combination is not available");
      }
    } else {
      setError("");
    }
  };

  const handleSizeSelect = (sizeId) => {
    const selectedSize = getSizeById(sizeId);
    if (!selectedSize) return;

    const partialVariant = {
      ...(selectedVariant || {}),
      size: sizeId,
      color: currentColor ? currentColor.id : selectedVariant?.color || null,
    };

    setSelectedVariant(partialVariant);
    if (currentColor) {
      const exactVariant = productDetails.allVariants.find(
        (variant) =>
          variant.size === sizeId && variant.color === currentColor.id
      );

      if (exactVariant) {
        setError("");
      } else {
        setError("This color and size combination is not available");
      }
    } else {
      setError("");
    }
  };
  // selected color
  const getAvailableSizesForColor = (colorId) => {
    if (!colorId) return productDetails.availableSizes;

    const sizes = productDetails.allVariants
      .filter((variant) => variant.color === colorId)
      .map((variant) => {
        const size = productDetails.availableSizes.find(
          (s) => s.id === variant.size
        );
        return size;
      })
      .filter(Boolean);

    // Remove duplicates
    return sizes.filter(
      (size, index, self) => index === self.findIndex((s) => s.id === size.id)
    );
  };

  // selected size
  const getAvailableColorsForSize = (sizeId) => {
    if (!sizeId) return productDetails.availableColors;

    const colors = productDetails.allVariants
      .filter((variant) => variant.size === sizeId)
      .map((variant) => {
        const color = productDetails.availableColors.find(
          (c) => c.id === variant.color
        );
        return color;
      })
      .filter(Boolean);

    return colors.filter(
      (color, index, self) => index === self.findIndex((c) => c.id === color.id)
    );
  };

  const getColorById = (colorId) => {
    return productDetails.availableColors.find((color) => color.id === colorId);
  };

  const getSizeById = (sizeId) => {
    return productDetails.availableSizes.find((size) => size.id === sizeId);
  };

  useEffect(() => {
    const fetchSingleProductData = async () => {
      try {
        const product = await fetchSingleProduct(params.product, token);
        const productData = product?.data || {
          title: "",
          brand: "",
          images: [],
          price: 0,
          description: "",
          isWishlist: false,
          selectedVariant: null,
          availableSizes: [],
          availableColors: [],
          allVariants: [],
        };
        setLoading(false);
        setProductDetails(productData);

        // Set the first variant as default if none is selected
        if (
          productData.allVariants?.length > 0 &&
          !productData.selectedVariant
        ) {
          setSelectedVariant(productData.allVariants[0]);
        } else {
          setSelectedVariant(productData.selectedVariant);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching product:", error);
      }
    };
    fetchSingleProductData();
  }, [params.product]);

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

  const currentColor = selectedVariant
    ? getColorById(selectedVariant.color)
    : null;
  const currentSize = selectedVariant
    ? getSizeById(selectedVariant.size)
    : null;
  const availableSizes = currentColor
    ? getAvailableSizesForColor(currentColor.id)
    : productDetails.availableSizes;
  const availableColors = currentSize
    ? getAvailableColorsForSize(currentSize.id)
    : productDetails.availableColors;

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="container mx-auto py-6 px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="hidden lg:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
                {visibleImages?.map((item, index) => (
                  <div
                    key={index}
                    className="relative w-full h-[200px] sm:h-[300px] cursor-pointer"
                    onClick={() => openModal(index)}
                  >
                    <Image
                      src={item}
                      alt={`${productDetails?.title}-${index}`}
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

              <div className="lg:hidden">
                <Slider {...sliderSettings}>
                  {productDetails?.images?.map((item, index) => (
                    <div
                      key={index}
                      className="relative w-full h-[300px] cursor-pointer"
                      onClick={() => openModal(index)}
                    >
                      <Image
                        src={item}
                        alt={`${productDetails.title}-${index}`}
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </Slider>
              </div>

              <div className="space-y-4">
                <h2 className="text-2xl ">{productDetails.title}</h2>
                <p className="text-xl font-bold">
                  ${selectedVariant?.price || productDetails.price}
                </p>
                <p className="text-gray-700">{productDetails.description}</p>

                <div>
                  <p className="text-xl font-medium mb-2">Size</p>
                  <div className="flex flex-wrap gap-2">
                    {productDetails?.availableSizes?.map((size) => (
                      <button
                        key={size.id}
                        onClick={() => handleSizeSelect(size.id)}
                        className={`px-4 py-1 border cursor-pointer rounded-md text-lg font-medium transition ${
                          currentSize?.id === size.id
                            ? "bg-yellow-800 text-white border-yellow-800"
                            : "text-gray-800 border-gray-300"
                        }`}
                      >
                        {size.name}
                      </button>
                    ))}
                  </div>

                  <div className="flex justify-start items-center">
                    <div>
                      <p className="text-xl font-medium mb-2 pt-4">Colors</p>
                      <div className="flex gap-2">
                        {productDetails?.availableColors?.map((colorOption) => (
                          <button
                            key={colorOption.id}
                            onClick={() => handleColorSelect(colorOption.id)}
                            style={{
                              backgroundColor:
                                currentColor?.id === colorOption.id
                                  ? colorOption.color
                                  : "transparent",
                              border: `1px solid ${
                                colorOption.id ? colorOption.color : "#OOO"
                              }`,
                              color:
                                currentColor?.id === colorOption.id
                                  ? "#fff"
                                  : colorOption.color,
                            }}
                            className={`px-4 py-1 cursor-pointer rounded-md text-lg font-medium transition`}
                          >
                            {colorOption.name}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="sm:px-5">
                      <p className="text-xl font-medium mb-2 pt-4">Quantity:</p>
                      <div className="flex justify-center rounded-md items-center py-1 border px-3">
                        <p
                          className="text-xl cursor-pointer"
                          onClick={() =>
                            setQuantity(handleDecrementQuantity(quantity))
                          }
                        >
                          <FiMinus />
                        </p>
                        <p className="px-4 text-xl">{quantity}</p>
                        <p className="text-xl cursor-pointer">
                          <FiPlus
                            onClick={() =>
                              setQuantity(handleIncrementQuantity(quantity))
                            }
                          />
                        </p>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <div className="mt-4 p-2 text-sm bg-red-100 border border-red-400 text-red-700 rounded">
                      {error}
                    </div>
                  )}

                  <div className="sm:flex items-center pt-7 pb-4">
                    <Button
                      label="ADD TO WISHLIST"
                      disabled={error ? true : false}
                      icon={<FiHeart size={20} />}
                      size="lg"
                      variant="solid"
                      className="!bg-brown-900 w-full sm:w-auto !py-2.5 !rounded-0 flex items-center gap-[10px]"
                      onClick={handleWishList}
                    />

                    <Button
                      label="ADD TO CART"
                      disabled={error ? true : false}
                      size="lg"
                      variant="solid"
                      className="!bg-yellow-800 w-full sm:w-auto !py-2.5 !rounded-0 mt-4 sm:mt-0 sm:mx-5 flex items-center gap-[10px]"
                      onClick={handleAddToCart}
                    />
                  </div>
                  <div>
                    <Button
                      label="BUY NOW"
                      disabled={error ? true : false}
                      size="lg"
                      variant="solid"
                      className="!bg-yellow-800 w-full !rounded-0 !py-2.5 flex items-center gap-[10px]"
                      onClick={() =>
                        redirect(token ? "/check-out/address" : "/auth/sign-in")
                      }
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
          {isModalOpen && productDetails.images.length > 0 && (
            <div className="fixed inset-0 z-50 bg-black-200 bg-opacity-90 flex items-center justify-center p-4 overflow-hidden">
              <div className="relative w-full bg-yellow-400 max-w-6xl border-4 border-gray-600 p-5 sm:p-10 shadow-lg rounded-3xl overflow-hidden h-[70vh] sm:h-[80vh] flex flex-col">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute cursor-pointer top-5 right-5 text-black text-3xl z-50"
                >
                  <HiOutlineX />
                </button>

                <div className="relative flex-1 w-full mb-4">
                  <div className="relative w-full h-full">
                    <Image
                      src={productDetails.images[currentImageIndex]}
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
                  {productDetails.images.map((item, index) => (
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
                        src={item}
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
      )}
    </>
  );
};

export default ProductDetailsPage;
