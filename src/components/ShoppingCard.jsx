"use client";

import React, { useEffect, useState } from "react";
import { TbHeart, TbHeartFilled } from "react-icons/tb";
import { LuEye } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Button from "./Button";
import ProductDetails from "@/app/product/components/ProductDetails";
import { useAddtocart } from "@/forntend/context/AddToCartContext";
import { fetchSingleProduct } from "@/forntend/services/productService";
import Toast from "./toastService";

const ShoppingCard = ({
  image,
  text,
  price,
  id,
  isWishList,
  onCardUpdateData,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { addtocart } = useAddtocart();
  const [productId, setProductId] = useState(null);

  const handleNavigate = () => {
    router.push(`/product/${id}`);
  };

  const handleAddToCart = async () => {
    try {
      const response = await addtocart(id);

      Toast.success("Product added to cart!");
      // if (response) {
      //   router.push("/your-cart");
      // }
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleProductDetails = () => {
    setProductId(id);
    setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  useEffect(() => {
    console.log("hellow");
  }, [productId, isOpen]);

  return (
    <div {...(!isOpen && { "data-aos": "fade-up" })}>
      <div className="rounded-t-full bg-brown-500 mx-2 sm:mx-4 h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
        <ProductDetails
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          productId={productId} // Directly pass the id
        />

        <div onClick={handleNavigate} className="cursor-pointer">
          <div className="h-[200px] sm:h-[400px] xl:h-[340px] px-3 sm:px-5 pt-3 sm:pt-5">
            <img
              src={image}
              alt={text}
              className="object-cover w-full h-full rounded-full border-6 border-brown-900"
            />
          </div>
          <p className="text-center text-lg pt-5 pb-1 sm:text-xl">{text}</p>
          {price && (
            <div className="text-center text-md sm:text-xl py-1">
              ${price?.toFixed(2)}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center px-4 pt-2 pb-5">
          <div className="flex order-1 md:order-2 gap-2 mb-4 md:mb-0">
            <div
              className="bg-white p-2 rounded-full cursor-pointer"
              onClick={onCardUpdateData}
            >
              {isWishList ? (
                <TbHeartFilled className="text-brown-900 text-2xl" />
              ) : (
                <TbHeart className="text-brown-900 text-2xl" />
              )}
            </div>
            <div className="bg-white p-2 rounded-full cursor-pointer">
              <LuEye
                className="text-brown-900 text-2xl"
                onClick={handleProductDetails} // Corrected the typo
              />
            </div>
          </div>

          <div className="order-2 md:order-1">
            <Button
              label="ADD TO CART"
              color="blue"
              size="md"
              variant="solid"
              className="!bg-white !text-black text-sm sm:text-md sm:py-2.5 rounded-1 text-nowrap sm:me-4"
              onClick={handleAddToCart}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCard;

// "use client";

// import React, { useState } from "react";
// import { TbHeart, TbHeartFilled } from "react-icons/tb";
// import { LuEye } from "react-icons/lu";
// import { useRouter } from "next/navigation";
// import Button from "./Button";
// import ProductDetails from "@/app/product/components/ProductDetails";
// import { useAddtocart } from "@/forntend/context/AddToCartContext";
// import { fetchSingleProduct } from "@/forntend/services/productService";

// const ShoppingCard = ({
//   image,
//   text,
//   price,
//   id,
//   isWishList,
//   onCardUpdateData,
// }) => {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);
//   const [productId, setProductId] = useState(null);
//   const { addtocart } = useAddtocart();
//   const handleNavigate = () => {
//     router.push(`/product/${id}`);
//   };

//   const handleAddToCart = async () => {
//     const response = await addtocart(id);
//     console.log(response);
//     if (response) {
//       router.push("/your-cart");
//     }
//   };

//   const handlePorductDetails = () => {
//     // const fetchProduct = async () => {
//     //   const response = await fetchSingleProduct(id);
//     //   setProductDetails(response.data)
//     // };
//     setProductId(id);
//     setTimeout(() => {
//       setIsOpen(true);
//     }, 100);

//     // fetchProduct();
//   };

//   return (
//     <div {...(!isOpen && { "data-aos": "fade-up" })}>
//       <div className="rounded-t-full bg-brown-500 mx-2 sm:mx-4 h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow duration-300">
//         <ProductDetails
//           isOpen={isOpen}
//           setIsOpen={setIsOpen}
//           productId={productId}
//         />
//         <div onClick={handleNavigate} className="cursor-pointer">
//           <div className="h-[200px] sm:h-[400px] xl:h-[340px] px-3 sm:px-5 pt-5">
//             <img
//               src={image}
//               alt={text}
//               className="object-cover w-full h-full rounded-full border-6 border-brown-900"
//             />
//           </div>
//           <p className="text-center text-lg pt-5 pb-1 sm:text-2xl">{text}</p>
//           {price && (
//             <div className="text-center text-md">${price?.toFixed(2)}</div>
//           )}
//         </div>

//         <div className="flex flex-col md:flex-row justify-center items-center px-4 pt-2 pb-5">
//           <div className="flex order-1 md:order-2 gap-2 mb-4 md:mb-0">
//             <div
//               className="bg-white p-2 rounded-full cursor-pointer"
//               onClick={onCardUpdateData}
//             >
//               {isWishList ? (
//                 <TbHeartFilled className="text-brown-900 text-2xl" />
//               ) : (
//                 <TbHeart className="text-brown-900 text-2xl" />
//               )}
//             </div>
//             <div className="bg-white p-2 rounded-full cursor-pointer">
//               <LuEye
//                 className="text-brown-900 text-2xl"
//                 onClick={handlePorductDetails}
//               />
//             </div>
//           </div>

//           <div className="order-2 md:order-1">
//             <Button
//               label="ADD TO CART"
//               color="blue"
//               size="md"
//               variant="solid"
//               className="!bg-white !text-black text-sm sm:text-md sm:py-2.5 rounded-1 text-nowrap sm:me-4"
//               onClick={handleAddToCart}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShoppingCard;
