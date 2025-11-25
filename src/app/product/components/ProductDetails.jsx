"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { CgCloseR } from "react-icons/cg";
import { FiMinus, FiPlus } from "react-icons/fi";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { fetchSingleProduct } from "@/forntend/services/productService";
import useToken from "@/forntend/hooks/useToken";
import { useAddtocart } from "@/forntend/context/AddToCartContext";
import { useWishlist } from "@/forntend/context/WishlistContext";

const ProductDetails = ({ isOpen, setIsOpen, productId }) => {
  const [productData, setProductData] = useState(null);
  const [availableSizes, setAvailableSizes] = useState([]);
  const [availableColors, setAvailableColors] = useState([]);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);
  const router = useRouter();
  const { token } = useToken();
  const { addtocart, buyNow } = useAddtocart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    if (!productId) return;

    const fetchProduct = async () => {
      try {
        const response = await fetchSingleProduct(productId, token);
        const data = response.data;

        setProductData(data);
        setAvailableSizes(data.availableSizes || []);
        setAvailableColors(data.availableColors || []);
        setError("");

        const variants = data.allVariants || [];
        if (variants.length > 0) {
          const firstVariant = variants[0];
          setSelectedSize(
            data.availableSizes?.find((s) => s.id === firstVariant.size) || null
          );
          setSelectedColor(
            data.availableColors?.find((c) => c.id === firstVariant.color) ||
              null
          );
          setSelectedVariant(firstVariant);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details.");
        setIsError(true);
      }
    };

    fetchProduct();
  }, [productId, token]);

  useEffect(() => {
    if (!productData || !selectedSize || !selectedColor) return;

    const variants = productData.allVariants || [];
    const match = variants.find(
      (v) => v.size === selectedSize.id && v.color === selectedColor.id
    );

    if (match) {
      setSelectedVariant(match);
      setIsError(false);
      setError("");
      setQuantity(1);
    } else {
      setSelectedVariant(null);
      setIsError(true);
      setError("This color and size combination is not available.");
    }
  }, [selectedSize, selectedColor, productData]);

  const increaseQuantity = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const closeModal = () => {
    setIsOpen(false);
    setError("");
    setIsError(false);
  };

  // Prevent scroll when modal open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
  }, [isOpen]);

  const handleInvalid = () => {
    setError("This color and size combination is not available.");
    setIsError(true);
  };

  const handleAddToWishlist = () => {
    if (token) {
      if (isError || error) return handleInvalid();
      addToWishlist(productData);
      router.push("/wishlist");
    } else {
      router.push("/auth/sign-in");
    }
  };

  const handleAddToCart = () => {
    if (token) {
      if (isError) return handleInvalid();
      addtocart(productData.id, selectedVariant);
      router.push("/your-cart");
    } else {
      router.push("/auth/sign-in");
    }
  };

  // const handleBuyNow = () => {
  //   if (token) {
  //     if (isError) return handleInvalid();
  //     router.push("/check-out");
  //   } else {
  //     router.push("/auth/sign-in");
  //   }
  // };

  const handleBuyNow = async () => {
    if (token) {
      if (isError) return handleInvalid();
      // const exactVariant = getExactVariant();

      if (selectedVariant) {
        const response = await buyNow(productId, selectedVariant, true);
        if (response) {
          router.push("/check-out/address");
        }
      }
    } else {
      router.push("/auth/sign-in");
    }
  };

  if (!isOpen || !productData) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-200 bg-opacity-50">
      <div
        className="absolute bg-white rounded-lg right-2 left-2 mx-auto max-w-5xl max-h-[90vh] h-auto overflow-y-auto"
        onClick={(e) => e.target === e.currentTarget && closeModal()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
          aria-label="Close modal"
        >
          <CgCloseR size={26} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="w-full md:w-2/5">
            <div className="relative h-64 md:h-full">
              <Image
                src={productData.images?.[0] || "/placeholder.png"}
                alt={productData.title}
                fill
                className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                priority
              />
            </div>
          </div>

          {/* Details Section */}
          <div className="w-full md:w-3/5 p-6 md:p-8 xl:px-12">
            <h3 className="text-xl sm:text-2xl pt-10">{productData.title}</h3>

            <p className="text-xl font-medium my-2 text-gray-900">
              s ${error ? 0 : selectedVariant?.price}
            </p>

            <p className="text-gray-600 mb-6">{productData.description}</p>

            {/* Size Selector */}
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <h4 className="font-medium text-lg mb-2">Size</h4>
                <div className="flex gap-2 flex-wrap">
                  {availableSizes.map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-1 border rounded-md text-lg ${
                        selectedSize?.id === size.id
                          ? "bg-yellow-800 text-white border-yellow-800"
                          : "border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color + Quantity */}
            <div className="flex flex-col sm:flex-row gap-6 mb-2">
              {/* Color */}
              {availableColors.length > 0 && (
                <div>
                  <h4 className="font-medium text-lg mb-2">Color</h4>
                  <div className="flex gap-2 flex-wrap">
                    {availableColors.map((color) => (
                      <button
                        key={color.id}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-1 border rounded-md text-lg  ${
                          selectedColor?.id === color.id
                            ? "text-white"
                            : "border-gray-300 hover:bg-gray-100"
                        }`}
                        style={{
                          backgroundColor:
                            selectedColor?.id === color.id
                              ? color.color
                              : "transparent",
                          border: `1px solid ${color.color || "#000"}`,
                          color:
                            selectedColor?.id === color.id
                              ? "#fff"
                              : color.color,
                        }}
                      >
                        {color.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <h4 className="font-medium text-lg mb-2">Quantity</h4>
                <div className="inline-flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="px-3 py-2 text-gray-600 disabled:opacity-50"
                  >
                    <FiMinus size={18} />
                  </button>

                  <span className="w-12 text-center text-lg font-medium">
                    {error ? 0 : quantity}
                  </span>

                  <button
                    onClick={increaseQuantity}
                    disabled={
                      !selectedVariant ||
                      quantity >= selectedVariant.stock ||
                      quantity >= 5
                    }
                    className="px-3 py-2 text-gray-600 disabled:opacity-50"
                  >
                    <FiPlus size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Error */}
            <div className={`mt-4 ${error ? "block" : "hidden"}`}>
              <div className="p-2 text-sm bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
                <span>{error}</span>
                <IoCloseOutline
                  size={20}
                  className="cursor-pointer"
                  onClick={() => {
                    setError("");
                    setIsError(true);
                  }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sm:flex pt-4">
              <div className="sm:pe-5 pb-5 sm:pb-0">
                <Button
                  icon={<IoMdHeartEmpty size={24} className="me-2" />}
                  label="ADD TO WISHLIST"
                  className="!bg-brown-900 text-white w-full sm:w-auto !py-2.5"
                  onClick={handleAddToWishlist}
                />
              </div>

              <div>
                <Button
                  label="ADD TO CART"
                  className="!bg-yellow-800 text-white w-full sm:w-auto !py-2.5"
                  onClick={handleAddToCart}
                />
              </div>
            </div>

            <div className="mt-6 mb-4">
              <Button
                label="BUY NOW"
                className="w-full !py-2.5 !bg-yellow-800 text-white hover:bg-yellow-900"
                onClick={handleBuyNow}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

// "use client";

// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { CgCloseR } from "react-icons/cg";
// import { FiMinus, FiPlus } from "react-icons/fi";
// import { IoMdHeartEmpty } from "react-icons/io";
// import { IoCloseOutline } from "react-icons/io5";
// import Button from "@/components/Button";
// import { useRouter } from "next/navigation";
// import { fetchSingleProduct } from "@/forntend/services/productService";
// import useToken from "@/forntend/hooks/useToken";

// const ProductDetails = ({ isOpen, setIsOpen, productId }) => {
//   const [productData, setProductData] = useState(null);
//   const [availableSizes, setAvailableSizes] = useState([]);
//   const [availableColors, setAvailableColors] = useState([]);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [error, setError] = useState("");
//   const [isError, setIsError] = useState(false);
//   const router = useRouter();
//   const { token } = useToken();

//   useEffect(() => {
//     if (!productId) return;

//     const fetchProduct = async () => {
//       try {
//         const response = await fetchSingleProduct(productId, token);
//         const data = response.data;

//         setProductData(data);
//         setAvailableSizes(data.availableSizes || []);
//         setAvailableColors(data.availableColors || []);
//         setError("");

//         const variants = data.allVariants || [];
//         if (variants.length > 0) {
//           const firstVariant = variants[0];
//           setSelectedSize(
//             data.availableSizes?.find((s) => s.id === firstVariant.size) || null
//           );
//           setSelectedColor(
//             data.availableColors?.find((c) => c.id === firstVariant.color) ||
//               null
//           );
//           setSelectedVariant(firstVariant);
//         }
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         setError("Failed to load product details.");
//         setIsError(true);
//       }
//     };

//     fetchProduct();
//   }, [productId, token]);
//   useEffect(() => {
//     if (!productData || !selectedSize || !selectedColor) return;

//     const variants = productData.allVariants || [];
//     const match = variants.find(
//       (v) => v.size === selectedSize.id && v.color === selectedColor.id
//     );

//     if (match) {
//       setSelectedVariant(match);
//       setIsError(false);
//       setError("");
//       setQuantity(1);
//     } else {
//       setSelectedVariant(null);
//       setIsError(true);
//       setError("This color and size combination is not available.");
//     }
//   }, [selectedSize, selectedColor, productData]);

//   const increaseQuantity = () => {
//     if (selectedVariant && quantity < selectedVariant.stock) {
//       setQuantity((prev) => prev + 1);
//     }
//   };

//   const decreaseQuantity = () => {
//     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
//   };
//   const closeModal = () => {
//     setIsOpen(false);
//     setError("");
//     setIsError(false);
//   };

//   // Prevent scroll when modal open
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "unset";
//   }, [isOpen]);

//   const handleInvalid = () => {
//     setError("This color and size combination is not available.");
//     setIsError(true);
//   };

//   const handleAddToWishlist = () => {
//     if (token) {
//       if (isError || error) return handleInvalid();
//       router.push("/wishlist");
//     } else {
//       router.push("/auth/sign-in");
//     }
//   };

//   const handleAddToCart = () => {
//     if (token) {
//       if (isError) return handleInvalid();
//       router.push("/your-cart");
//     } else {
//       router.push("/auth/sign-in");
//     }
//   };

//   const handleBuyNow = () => {
//     if (token) {
//       if (isError) return handleInvalid();
//       router.push("/check-out");
//     } else {
//       router.push("/auth/sign-in");
//     }
//   };

//   if (!isOpen || !productData) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-200 bg-opacity-50">
//       <div
//         className="absolute bg-white rounded-lg right-2 left-2 mx-auto max-w-5xl max-h-[90vh] h-auto overflow-y-auto"
//         onClick={(e) => e.target === e.currentTarget && closeModal()}
//       >
//         {/* Close Button */}
//         <button
//           onClick={closeModal}
//           className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
//           aria-label="Close modal"
//         >
//           <CgCloseR size={26} />
//         </button>

//         <div className="flex flex-col md:flex-row">
//           {/* Image Section */}
//           <div className="w-full md:w-2/5">
//             <div className="relative h-64 md:h-full">
//               <Image
//                 src={productData.images?.[0] || "/placeholder.png"}
//                 alt={productData.title}
//                 fill
//                 className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
//                 priority
//               />
//             </div>
//           </div>

//           {/* Details Section */}
//           <div className="w-full md:w-3/5 p-6 md:p-8 xl:px-12">
//             <h3 className="text-xl sm:text-2xl pt-10">{productData.title}</h3>

//             <p className="text-xl font-medium my-2 text-gray-900">
//               ${error ? 0 : selectedVariant?.price}
//             </p>

//             <p className="text-gray-600 mb-6">{productData.description}</p>

//             {/* Size Selector */}
//             {availableSizes.length > 0 && (
//               <div className="mb-6">
//                 <h4 className="font-medium text-lg mb-2">Size</h4>
//                 <div className="flex gap-2 flex-wrap">
//                   {availableSizes.map((size) => (
//                     <button
//                       key={size.id}
//                       onClick={() => setSelectedSize(size)}
//                       className={`px-6 py-1 border rounded-md text-lg ${
//                         selectedSize?.id === size.id
//                           ? "bg-yellow-800 text-white border-yellow-800"
//                           : "border-gray-300 hover:bg-gray-100"
//                       }`}
//                     >
//                       {size.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Color + Quantity */}
//             <div className="flex flex-col sm:flex-row gap-6 mb-2">
//               {/* Color */}
//               {availableColors.length > 0 && (
//                 <div>
//                   <h4 className="font-medium text-lg mb-2">Color</h4>
//                   <div className="flex gap-2 flex-wrap">
//                     {availableColors.map((color) => (
//                       <button
//                         key={color.id}
//                         onClick={() => setSelectedColor(color)}
//                         className={`px-4 py-1 border rounded-md text-lg  ${
//                           selectedColor?.id === color.id
//                             ? "text-white"
//                             : "border-gray-300 hover:bg-gray-100"
//                         }`}
//                         style={{
//                           backgroundColor:
//                             selectedColor?.id === color.id
//                               ? color.color
//                               : "transparent",
//                           border: `1px solid ${color.color || "#000"}`,
//                           color:
//                             selectedColor?.id === color.id
//                               ? "#fff"
//                               : color.color,
//                         }}
//                       >
//                         {color.name}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Quantity */}
//               <div>
//                 <h4 className="font-medium text-lg mb-2">Quantity</h4>
//                 <div className="inline-flex items-center border border-gray-300 rounded-md">
//                   <button
//                     onClick={decreaseQuantity}
//                     disabled={quantity <= 1}
//                     className="px-3 py-2 text-gray-600 disabled:opacity-50"
//                   >
//                     <FiMinus size={18} />
//                   </button>

//                   <span className="w-12 text-center text-lg font-medium">
//                     {error ? 0 : quantity}
//                   </span>

//                   <button
//                     onClick={increaseQuantity}
//                     disabled={
//                       !selectedVariant ||
//                       quantity >= selectedVariant.stock ||
//                       quantity >= 5
//                     }
//                     className="px-3 py-2 text-gray-600 disabled:opacity-50"
//                   >
//                     <FiPlus size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Error */}
//             <div className={`mt-4 ${error ? "block" : "hidden"}`}>
//               <div className="p-2 text-sm bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
//                 <span>{error}</span>
//                 <IoCloseOutline
//                   size={20}
//                   className="cursor-pointer"
//                   onClick={() => {
//                     setError("");
//                     setIsError(true);
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="sm:flex pt-4">
//               <div className="sm:pe-5 pb-5 sm:pb-0">
//                 <Button
//                   icon={<IoMdHeartEmpty size={24} className="me-2" />}
//                   label="ADD TO WISHLIST"
//                   className="!bg-brown-900 text-white w-full sm:w-auto !py-2.5"
//                   onClick={handleAddToWishlist}
//                 />
//               </div>

//               <div>
//                 <Button
//                   label="ADD TO CART"
//                   className="!bg-yellow-800 text-white w-full sm:w-auto !py-2.5"
//                   onClick={handleAddToCart}
//                 />
//               </div>
//             </div>

//             <div className="mt-6 mb-4">
//               <Button
//                 label="BUY NOW"
//                 className="w-full !py-2.5 !bg-yellow-800 text-white hover:bg-yellow-900"
//                 onClick={handleBuyNow}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

// "use client";
// import React, { useState, useEffect } from "react";
// import Image from "next/image";
// import { CgCloseR } from "react-icons/cg";
// import { FiMinus, FiPlus } from "react-icons/fi";
// import { IoMdHeartEmpty } from "react-icons/io";
// import Button from "@/components/Button";
// import { useRouter } from "next/navigation";
// import { fetchSingleProduct } from "@/forntend/services/productService";
// import useToken from "@/forntend/hooks/useToken";
// import { IoCloseOutline } from "react-icons/io5";

// const ProductDetails = ({ isOpen, setIsOpen, productId }) => {
//   const [productData, setProductData] = useState(null);
//   const [availableSizes, setAvailableSizes] = useState([]);
//   const [availableColors, setAvailableColors] = useState([]);
//   const [selectedSize, setSelectedSize] = useState(null);
//   const [selectedColor, setSelectedColor] = useState(null);
//   const [selectedVariant, setSelectedVariant] = useState(null);
//   const [quantity, setQuantity] = useState(1);
//   const [error, setError] = useState("");
//   const [isError, setIsError] = useState(false);
//   const router = useRouter();
//   const { token } = useToken();

//   // Fetch product details when productId / token changes
//   useEffect(() => {
//     if (!productId) return;

//     const fetchProduct = async () => {
//       try {
//         const response = await fetchSingleProduct(productId, token);
//         const data = response.data;

//         setProductData(data);
//         setAvailableSizes(data.availableSizes || []);
//         setAvailableColors(data.availableColors || []);
//         setError("");

//         const variants = data.allVariants || [];
//         if (variants.length > 0) {
//           const firstVariant = variants[0];
//           const firstSize = data.availableSizes?.find(
//             (size) => size.id === firstVariant.size
//           );
//           const firstColor = data.availableColors?.find(
//             (color) => color.id === firstVariant.color
//           );

//           setSelectedSize(firstSize || null);
//           setSelectedColor(firstColor || null);
//           setSelectedVariant(firstVariant);
//         }
//       } catch (err) {
//         console.error("Error fetching product:", err);
//         setError("Failed to load product details");
//         setIsError(true);
//       }
//     };

//     fetchProduct();
//   }, [productId, token]);

//   // When size or color changes, pick matching variant & set error if not found
//   useEffect(() => {
//     if (!productData || !selectedSize || !selectedColor) {
//       return;
//     }

//     const variants = productData.allVariants || [];
//     const matching = variants.find(
//       (v) => v.size === selectedSize.id && v.color === selectedColor.id
//     );

//     if (matching) {
//       setSelectedVariant(matching);
//       setError("");
//       setIsError(false);
//       setQuantity(1);
//     } else {
//       setSelectedVariant(null);
//       setError("This color and size combination is not available");
//       setIsError(true);
//     }
//   }, [selectedSize, selectedColor, productData]);

//   // Quantity handlers
//   const increaseQuantity = () => {
//     if (selectedVariant && quantity < selectedVariant.stock) {
//       setQuantity((q) => q + 1);
//     }
//   };
//   const decreaseQuantity = () => {
//     setQuantity((q) => (q > 1 ? q - 1 : 1));
//   };

//   const closeModal = () => {
//     setIsOpen(false);
//     setError("");
//     setIsError(false);
//   };

//   const handleSizeChange = (size) => {
//     setSelectedSize(size);
//   };

//   const handleColorChange = (color) => {
//     setSelectedColor(color);
//   };

//   // Prevent body scroll when modal open
//   useEffect(() => {
//     document.body.style.overflow = isOpen ? "hidden" : "unset";
//   }, [isOpen]);

//   // Button handlers
//   const handleAddToWishlist = () => {
//     if (isError || error) {
//       setError("Please select a valid color & size combination.");

//       return;
//     }
//     router.push("/wishlist");
//   };

//   const handleAddToCart = () => {
//     if (isError || error) {
//       setError("Please select a valid color & size combination.");
//       return;
//     }
//     router.push("/your-cart");
//   };

//   const handleBuyNow = () => {
//     if (isError || error) {
//       setError("Please select a valid color & size combination.");
//       return;
//     }
//     router.push("/check-out");
//   };

//   if (!isOpen || !productData) return null;

//   return (
//     <div className="fixed inset-0 z-50 flex items-center justify-center bg-black-200 bg-opacity-50">
//       <div
//         className="absolute bg-white rounded-lg right-2 left-2 mx-auto md:h-auto h-full max-w-5xl max-h-[90vh] overflow-y-auto"
//         onClick={(e) => e.target === e.currentTarget && closeModal()}
//       >
//         {/* Close Modal */}
//         <button
//           onClick={closeModal}
//           className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 z-10"
//           aria-label="Close modal"
//         >
//           <CgCloseR size={26} />
//         </button>

//         <div className="flex flex-col md:flex-row">
//           {/* Image */}
//           <div className="w-full md:w-2/5">
//             <div className="relative h-64 md:h-full">
//               <Image
//                 src={productData.images[0]}
//                 alt={productData.title}
//                 fill
//                 className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
//                 priority
//               />
//             </div>
//           </div>

//           {/* Details */}
//           <div className="w-full md:w-3/5 p-6 md:p-8 xl:px-12">
//             <h3 className="text-xl sm:text-2xl pt-10">{productData.title}</h3>
//             <p className="text-xl font-medium text-gray-900 my-2">
//               ${selectedVariant ? selectedVariant.price : "--"}
//             </p>
//             <p className="text-gray-600 mb-6">{productData.description}</p>

//             {/* Size */}
//             {availableSizes.length > 0 && (
//               <div className="mb-6">
//                 <h4 className="font-medium text-lg mb-2">Size</h4>
//                 <div className="flex gap-2">
//                   {availableSizes.map((size) => (
//                     <button
//                       key={size.id}
//                       onClick={() => handleSizeChange(size)}
//                       className={`px-6 py-1 border rounded-md text-lg cursor-pointer ${
//                         selectedSize?.id === size.id
//                           ? "bg-yellow-800 text-white border-yellow-800"
//                           : "border-gray-300 hover:bg-gray-100"
//                       }`}
//                     >
//                       {size.name}
//                     </button>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Color + Quantity */}
//             <div className="flex flex-col sm:flex-row gap-6 mb-2">
//               {availableColors.length > 0 && (
//                 <div>
//                   <h4 className="font-medium text-lg mb-2">Color</h4>
//                   <div className="flex gap-2">
//                     {availableColors.map((color) => (
//                       <button
//                         key={color.id}
//                         onClick={() => handleColorChange(color)}
//                         className={`px-4 py-1 border rounded-md text-lg cursor-pointer ${
//                           selectedColor?.id === color.id
//                             ? "text-white border-yellow-800"
//                             : "border-gray-300 hover:bg-gray-100"
//                         }`}
//                         style={{
//                           backgroundColor:
//                             selectedColor?.id === color.id
//                               ? color.color
//                               : "transparent",
//                           borderColor: color.color,
//                         }}
//                       >
//                         {color.name}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div>
//                 <h4 className="font-medium text-lg mb-2">Quantity</h4>
//                 <div className="inline-flex items-center border border-gray-300 rounded-md">
//                   <button
//                     onClick={decreaseQuantity}
//                     disabled={quantity <= 1}
//                     className="px-3 py-2 text-gray-600 disabled:opacity-50 cursor-pointer"
//                   >
//                     <FiMinus size={18} />
//                   </button>

//                   <span className="w-12 text-center text-lg font-medium">
//                     {quantity}
//                   </span>

//                   <button
//                     onClick={increaseQuantity}
//                     disabled={
//                       selectedVariant && quantity >= selectedVariant.stock
//                     }
//                     className="px-3 py-2 text-gray-600 disabled:opacity-50 cursor-pointer"
//                   >
//                     <FiPlus size={18} />
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Error box */}
//             <div
//               className={`mt-4 transition-all duration-300 ease-out ${
//                 error && isError ? "block" : "hidden"
//               }`}
//             >
//               <div className="p-2 text-sm bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
//                 <span>{error}</span>
//                 <IoCloseOutline
//                   size={20}
//                   className="cursor-pointer"
//                   onClick={() => {
//                     setError(false), setError(true);
//                   }}
//                 />
//               </div>
//             </div>

//             {/* Action buttons */}
//             <div className="sm:flex pt-4">
//               <div className="sm:pe-5 pb-5 sm:pb-0">
//                 <Button
//                   icon={<IoMdHeartEmpty size={24} className="me-2" />}
//                   label="ADD TO WISHLIST"
//                   className="!bg-brown-900 text-white w-full sm:w-auto !py-2.5"
//                   onClick={handleAddToWishlist}
//                 />
//               </div>

//               <div>
//                 <Button
//                   label="ADD TO CART"
//                   className="!bg-yellow-800 text-white w-full sm:w-auto !py-2.5"
//                   onClick={handleAddToCart}
//                 />
//               </div>
//             </div>

//             <div className="mt-6 mb-4">
//               <Button
//                 label="BUY NOW"
//                 className="w-full !py-2.5 !bg-yellow-800 text-white hover:bg-yellow-900"
//                 onClick={handleBuyNow}
//               />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductDetails;

// // "use client";
// // import React, { useState, useEffect } from "react";
// // import Image from "next/image";
// // import { CgCloseR } from "react-icons/cg";
// // import { FiMinus, FiPlus } from "react-icons/fi";
// // import { IoMdHeartEmpty } from "react-icons/io";
// // import Button from "@/components/Button";
// // import { useRouter } from "next/navigation";
// // import { fetchSingleProduct } from "@/forntend/services/productService";
// // import useToken from "@/forntend/hooks/useToken";
// // import { IoCloseOutline } from "react-icons/io5";

// // const ProductDetails = ({ isOpen, setIsOpen, productId }) => {
// //   const [productData, setProductData] = useState(null);
// //   const [availableSizes, setAvailableSizes] = useState([]);
// //   const [availableColors, setAvailableColors] = useState([]);
// //   const [selectedSize, setSelectedSize] = useState(null);
// //   const [selectedColor, setSelectedColor] = useState(null);
// //   const [selectedVariant, setSelectedVariant] = useState(null);
// //   const [quantity, setQuantity] = useState(1);
// //   const [error, setError] = useState("");

// //   const router = useRouter();
// //   const { token } = useToken();
// //   useEffect(() => {
// //     if (!productId) return;

// //     const fetchProduct = async () => {
// //       try {
// //         const response = await fetchSingleProduct(productId, token);
// //         const data = response.data;

// //         setProductData(data);
// //         setAvailableSizes(data.availableSizes || []);
// //         setAvailableColors(data.availableColors || []);
// //         setError("");

// //         const variants = data.allVariants || [];

// //         // Auto-select the first variant's size and color
// //         if (variants.length > 0) {
// //           const firstVariant = variants[0];
// //           const firstSize = data.availableSizes?.find(
// //             (size) => size.id === firstVariant.size
// //           );
// //           const firstColor = data.availableColors?.find(
// //             (color) => color.id === firstVariant.color
// //           );

// //           setSelectedSize(firstSize || null);
// //           setSelectedColor(firstColor || null);
// //           setSelectedVariant(firstVariant);
// //         }
// //       } catch (error) {
// //         console.error("Error fetching product:", error);
// //         setError("Failed to load product details");
// //       }
// //     };

// //     fetchProduct();
// //   }, [productId, token]);

// //   // Update selected variant when size or color changes
// //   useEffect(() => {
// //     if (!productData || !selectedSize || !selectedColor) return;

// //     const variants = productData.allVariants || [];

// //     // Find the variant that matches both selected size and selected color
// //     const matchingVariant = variants.find(
// //       (variant) =>
// //         variant.size === selectedSize.id && variant.color === selectedColor.id
// //     );

// //     if (matchingVariant) {
// //       setSelectedVariant(matchingVariant);
// //       setError("");
// //       setQuantity(1);
// //     } else {
// //       setSelectedVariant(null);
// //       setError("This color and size combination is not available");
// //     }
// //   }, [selectedSize, selectedColor, productData]);

// //   // Quantity control
// //   const increaseQuantity = () => {
// //     if (selectedVariant && quantity < selectedVariant.stock) {
// //       setQuantity((prev) => prev + 1);
// //     }
// //   };

// //   const decreaseQuantity = () => {
// //     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
// //   };

// //   const onClose = () => {
// //     setIsOpen(false);
// //     setError("");
// //   };

// //   const handleSizeChange = (size) => {
// //     setSelectedSize(size);
// //   };

// //   const handleColorChange = (color) => {
// //     setSelectedColor(color);
// //   };

// //   // Prevent body scroll on modal open
// //   useEffect(() => {
// //     document.body.style.overflow = isOpen ? "hidden" : "unset";
// //   }, [isOpen]);

// //   const handleBuyNow = () => {
// //     if (error) {
// //       router.push("/check-out"),
// //         setError("This color and size combination is not available");
// //     }
// //   };

// //   // Don't render if not open or no product data
// //   if (!isOpen || !productData) return null;

// //   return (
// //     <div className="bg-white">
// //       <div
// //         className="fixed inset-0 z-50 flex items-center justify-center bg-black-200 bg-opacity-50"
// //         onClick={(e) => e.target === e.currentTarget && onClose()}
// //       >
// //         <div className="absolute bg-white rounded-lg w-auto right-2 left-2 mx-auto md:h-auto h-full max-w-5xl max-h-[90vh] overflow-y-auto">
// //           {/* Close Button */}
// //           <button
// //             onClick={onClose}
// //             className="absolute top-4 right-4 cursor-pointer text-gray-500 hover:text-gray-700 z-10"
// //             aria-label="Close modal"
// //           >
// //             <CgCloseR size={26} />
// //           </button>

// //           <div className="flex flex-col md:flex-row">
// //             {/* Product Image */}
// //             <div className="w-full md:w-2/5">
// //               <div className="relative h-64 md:h-full">
// //                 <Image
// //                   src={productData.images[0]}
// //                   alt={productData.title}
// //                   fill
// //                   className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
// //                   priority
// //                 />
// //               </div>
// //             </div>

// //             {/* Right Side Content */}
// //             <div className="w-full md:w-3/5 p-6 md:p-8 xl:px-12">
// //               <div className="flex justify-between">
// //                 <div>
// //                   <h3 className="text-xl sm:text-2xl pt-10">
// //                     {productData.title}
// //                   </h3>
// //                   <p className="text-xl font-medium text-gray-900 my-2">
// //                     ${selectedVariant ? selectedVariant.price : "0"}
// //                   </p>
// //                 </div>
// //               </div>

// //               <p className="text-gray-600 mb-6">{productData.description}</p>

// //               {/* Size Selection */}
// //               {availableSizes.length > 0 && (
// //                 <div className="mb-6">
// //                   <h4 className="font-medium text-lg mb-2">Size</h4>
// //                   <div className="flex gap-2">
// //                     {availableSizes.map((size) => (
// //                       <button
// //                         key={size.id}
// //                         onClick={() => handleSizeChange(size)}
// //                         className={`px-6 py-1 border rounded-md text-lg cursor-pointer ${
// //                           selectedSize?.id === size.id
// //                             ? "bg-yellow-800 text-white border-yellow-800"
// //                             : "border-gray-300 hover:bg-gray-100"
// //                         }`}
// //                       >
// //                         {size.name}
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>
// //               )}

// //               {console.log("selectedColor=====", selectedColor)}
// //               <div className="flex flex-col sm:flex-row gap-6 mb-2">
// //                 {/* Color Selection */}
// //                 {availableColors.length > 0 && (
// //                   <div>
// //                     <h4 className="font-medium text-lg mb-2">Colours</h4>
// //                     <div className="flex gap-2">
// //                       {availableColors.map((color) => (
// //                         <button
// //                           key={color.id}
// //                           onClick={() => handleColorChange(color)}
// //                           className={`px-4 py-1 border rounded-md text-lg cursor-pointer ${
// //                             selectedColor?.id === color.id
// //                               ? "text-white border-yellow-800"
// //                               : "border-gray-300 hover:bg-gray-100"
// //                           }`}
// //                           style={{
// //                             backgroundColor:
// //                               selectedColor?.id === color.id
// //                                 ? color.color
// //                                 : "transparent",
// //                             borderColor: color.color,
// //                           }}
// //                         >
// //                           {color.name}
// //                         </button>
// //                       ))}
// //                     </div>
// //                   </div>
// //                 )}

// //                 {/* Quantity Selector - Only show when variant is selected */}
// //                 <div>
// //                   <h4 className="font-medium text-lg mb-2">Quantity</h4>
// //                   <div className="inline-flex items-center border border-gray-300 rounded-md">
// //                     <button
// //                       onClick={decreaseQuantity}
// //                       disabled={quantity <= 1}
// //                       className="px-3 py-2 text-gray-600 disabled:opacity-50 cursor-pointer"
// //                     >
// //                       <FiMinus size={18} />
// //                     </button>

// //                     <span className="w-12 text-center text-lg font-medium">
// //                       {quantity}
// //                     </span>

// //                     <button
// //                       onClick={increaseQuantity}
// //                       disabled={quantity >= selectedVariant?.stock}
// //                       className="px-3 py-2 text-gray-600 disabled:opacity-50 cursor-pointer"
// //                     >
// //                       <FiPlus size={18} />
// //                     </button>
// //                   </div>
// //                 </div>
// //               </div>
// //               <div
// //                 className={`mt-4 transition-all duration-300 ease-out
// //                 ${error ? " translate-y-0 visible" : "hidden -translate-y-4"}`}
// //               >
// //                 <div className="p-2 text-sm bg-red-100 border border-red-400 text-red-700 rounded flex justify-between items-center">
// //                   <div>{error}</div>
// //                   <IoCloseOutline
// //                     size={20}
// //                     className="cursor-pointer"
// //                     onClick={() => setError("")}
// //                   />
// //                 </div>
// //               </div>

// //               <>
// //                 <div className="sm:flex pt-4">
// //                   <div className="sm:pe-5 pb-5 sm:pb-0">
// //                     <Button
// //                       icon={<IoMdHeartEmpty size={24} className="me-2" />}
// //                       disabled={error ? true : false}
// //                       label="ADD TO WISHLIST"
// //                       className="!bg-brown-900 text-white w-full sm:w-auto !py-2.5"
// //                       onClick={() => router.push("/wishlist")}
// //                     />
// //                   </div>

// //                   <div>
// //                     <Button
// //                       label="ADD TO CART"
// //                       disabled={error ? true : false}
// //                       className="!bg-yellow-800 text-white w-full sm:w-auto !py-2.5"
// //                       onClick={() => router.push("/your-cart")}
// //                     />
// //                   </div>
// //                 </div>

// //                 <div className="mt-6 mb-4">
// //                   <Button
// //                     label="BUY NOW"
// //                     disabled={error ? true : false}
// //                     className="w-full !py-2.5 !bg-yellow-800 text-white hover:bg-yellow-900"
// //                     onClick={handleBuyNow}
// //                   />
// //                 </div>
// //               </>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ProductDetails;

// // // "use client";
// // // import React, { useState, useEffect } from "react";
// // // import Image from "next/image";
// // // import { CgCloseR } from "react-icons/cg";
// // // import { FiMinus, FiPlus } from "react-icons/fi";
// // // import { IoMdHeartEmpty } from "react-icons/io";
// // // import Button from "@/components/Button";
// // // import { useRouter } from "next/navigation";

// // // const ProductDetails = ({ isOpen, setIsOpen }) => {
// // //   const [selectedSize, setSelectedSize] = useState("M");
// // //   const [selectedColor, setSelectedColor] = useState("Gold");
// // //   const [quantity, setQuantity] = useState(1);
// // //   const router = useRouter();

// // //   // Sample product
// // //   const productData = {
// // //     id: 1,
// // //     name: "Stone Pointed Toe Rings",
// // //     price: 578,
// // //     description:
// // //       "Cheer on your favorite red and white team in eye-popping style with these red & white striped game bib overalls! Each pair is made of 100 percent cotton for a comfortable, breathable fit regardless of the weather and includes...",
// // //     image: "/images/product_view_model_bg.png",
// // //   };

// // //   const sizes = ["S", "M", "L"];
// // //   const colors = ["Gold", "Silver"];

// // //   // Handle quantity changes
// // //   const increaseQuantity = () => setQuantity((prev) => prev + 1);
// // //   const decreaseQuantity = () =>
// // //     setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

// // //   // Prevent body scrolling when modal
// // //   useEffect(() => {
// // //     if (isOpen) {
// // //       document.body.style.overflow = "hidden";
// // //     } else {
// // //       document.body.style.overflow = "unset";
// // //     }
// // //     return () => {
// // //       document.body.style.overflow = "unset";
// // //     };
// // //   }, [isOpen]);

// // //   const onClose = () => {
// // //     setIsOpen(false);
// // //   };

// // //   // Handle click outside modal
// // //   const handleOverlayClick = (e) => {
// // //     if (e.target === e.currentTarget) {
// // //       onClose();
// // //     }
// // //   };

// // //   if (!isOpen) return null;

// // //   return (
// // //     <div
// // //       className="fixed inset-0 z-50 flex items-center justify-center bg-black-200 bg-opacity-50"
// // //       onClick={handleOverlayClick}
// // //     >
// // //       <div className="absolute bg-white rounded-lg w-auto right-2 left-2 mx-auto md:h-auto h-full max-w-6xl max-h-[90vh] overflow-y-auto">
// // //         {/* Close Button */}
// // //         <button
// // //           onClick={onClose}
// // //           className="absolute top-10 cursor-pointer right-4 text-gray-500 hover:text-gray-700"
// // //           aria-label="Close modal"
// // //         >
// // //           <CgCloseR size={26} />
// // //         </button>

// // //         <div className="flex flex-col md:flex-row">
// // //           {/* Product Image */}
// // //           <div className="w-full md:w-2/5">
// // //             <div className="relative h-64 md:h-full">
// // //               <Image
// // //                 src={productData.image}
// // //                 alt={productData.name}
// // //                 fill
// // //                 className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
// // //                 priority
// // //               />
// // //             </div>
// // //           </div>

// // //           {/* Product Details */}
// // //           <div className="w-full md:w-3/5 p-6 md:p-8 xl:px-12">
// // //             <div className="flex justify-between items-start">
// // //               <div>
// // //                 <h3 className="text-xl sm:text-2xl lg:pt-15 ">
// // //                   {productData.name}
// // //                 </h3>
// // //                 <p className="text-xl font-medium text-gray-900 my-2">
// // //                   ${productData.price}
// // //                 </p>
// // //               </div>
// // //               <div className="bg-yellow-400">
// // //                 <button
// // //                   onClick={onClose}
// // //                   className="absolute top-3 sm:top-10 cursor-pointer right-4 rounded-sm bg-yellow-400  p-2 sm:p-0 text-gray-500 hover:text-gray-700"
// // //                   aria-label="Close modal"
// // //                 >
// // //                   <CgCloseR size={26} />
// // //                 </button>
// // //               </div>
// // //             </div>
// // //             <p className="text-gray-600 mb-6">{productData.description}</p>
// // //             {/* Size Selection */}
// // //             <div className="mb-6">
// // //               <h4 className="font-medium text-lg mb-2">Size</h4>
// // //               <div className="flex gap-2">
// // //                 {sizes.map((size) => (
// // //                   <button
// // //                     key={size}
// // //                     onClick={() => setSelectedSize(size)}
// // //                     className={`px-6 py-1 text-lg border cursor-pointer rounded-md font-medium transition-colors ${
// // //                       selectedSize === size
// // //                         ? "bg-yellow-800 text-white border-yellow-800"
// // //                         : "border-gray-300 hover:bg-gray-100"
// // //                     }`}
// // //                   >
// // //                     {size}
// // //                   </button>
// // //                 ))}
// // //               </div>
// // //             </div>

// // //             {/* Color and Quantity */}
// // //             <div className="flex flex-col sm:flex-row gap-6 mb-6">
// // //               <div>
// // //                 <h4 className="font-medium text-lg mb-2">Colours</h4>
// // //                 <div className="flex gap-2">
// // //                   {colors.map((color) => (
// // //                     <button
// // //                       key={color}
// // //                       onClick={() => setSelectedColor(color)}
// // //                       className={`px-4 py-1 border cursor-pointer rounded-md text-lg font-medium transition-colors ${
// // //                         selectedColor === color
// // //                           ? "bg-yellow-800 text-white border-yellow-800"
// // //                           : "border-gray-300 hover:bg-gray-100"
// // //                       }`}
// // //                     >
// // //                       {color}
// // //                     </button>
// // //                   ))}
// // //                 </div>
// // //               </div>

// // //               {/* Quantity Selector */}
// // //               <div>
// // //                 <h4 className="font-medium text-lg mb-2">Quantity</h4>
// // //                 <div className="inline-flex items-center border border-gray-300 rounded-md">
// // //                   <button
// // //                     onClick={decreaseQuantity}
// // //                     disabled={quantity <= 1}
// // //                     className="px-3 py-2 text-gray-600 disabled:opacity-50 cursor-pointer "
// // //                     aria-label="Decrease quantity"
// // //                   >
// // //                     <FiMinus size={18} />
// // //                   </button>
// // //                   <span className="w-12 text-center text-lg font-medium">
// // //                     {quantity}
// // //                   </span>
// // //                   <button
// // //                     onClick={increaseQuantity}
// // //                     className="px-3 py-2 text-gray-600 cursor-pointer"
// // //                     aria-label="Increase quantity"
// // //                   >
// // //                     <FiPlus size={18} />
// // //                   </button>
// // //                 </div>
// // //               </div>
// // //             </div>

// // //             {/* Action Buttons */}
// // //             <div className="sm:flex">
// // //               <div className="sm:pe-5 pb-5 sm:pb-0">
// // //                 <Button
// // //                   icon={<IoMdHeartEmpty size={24} className="me-2" />}
// // //                   type="submit"
// // //                   label="ADD TO WISHLIST"
// // //                   color="primary"
// // //                   size="lg"
// // //                   variant="solid"
// // //                   className="bg-brown-900 w-full sm:w-auto !py-2.5 sm:!py-3 font-medium"
// // //                   onClick={() => router.push("/")}
// // //                 />
// // //               </div>
// // //               <div>
// // //                 <Button
// // //                   type="submit"
// // //                   label="ADD TO CART"
// // //                   color="primary"
// // //                   size="lg"
// // //                   variant="solid"
// // //                   className="!bg-yellow-800  w-full sm:w-auto !py-2.5 sm:!py-3 font-medium"
// // //                   onClick={() => router.push("your-cart")}
// // //                 />
// // //               </div>
// // //             </div>
// // //             <div className="my-4">
// // //               <Button
// // //                 label="BUY NOW"
// // //                 color="primary"
// // //                 size="lg"
// // //                 variant="solid"
// // //                 className="w-full !py-2.5 sm:!py-3 font-medium !bg-yellow-800 text-white hover:bg-yellow-900"
// // //                 onClick={() => router.push("check-out")}
// // //               />
// // //             </div>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default ProductDetails;
