import React, { useState } from "react";
import Button from "./Button";
import { LuHeart } from "react-icons/lu";
import { IoIosHeart } from "react-icons/io";

import { LuEye } from "react-icons/lu";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ProductDetails from "@/app/product/components/ProductDetails";
const ShoppingCard = ({
  image,
  text,
  className = "",
  price,
  isAddToCart = true,
  imageheight,
  heartbg,
  isLink,
}) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const handelChange = () => {
    if (isLink) {
      router.push("/product/1");
    }
  };

  return (
    <div className={`rounded-t-full bg-brown-500 ${className} mx-2 sm:mx-4`}>
      <ProductDetails isOpen={isOpen} setIsOpen={setIsOpen} />

      <div onClick={handelChange}>
        <div
          className={`p h-[200px] sm:h-[400px] xl:h-[340px] px-3 sm:px-5 ${imageheight} ${
            isAddToCart && " pt-3 sm:pt-5 rounded-t-full"
          }`}
        >
          <img
            src={image}
            alt={text}
            className="object-cover w-full h-full rounded-full border-6 border-brown-900"
          />
        </div>
        <p className="text-center text-lg pt-5 pb-1 sm:text-3xl xl:text-2xl">
          {text}
        </p>
        {price && <div className="text-center text-xl ">${price}.00</div>}
      </div>
      <div className="flex flex-col md:flex-row justify-center items-center px-4 pt-2 pb-5 sm:py-5">
        {/* Icons: Order 1 on md and above */}
        <div className="flex order-1 md:order-2 gap-2 mb-4 md:mb-0">
          <div className="bg-white  p-2 rounded-full">
            {heartbg ? (
              <IoIosHeart className="text-brown-900 pt-1 cursor-pointer text-lg sm:text-3xl" />
            ) : (
              <Link href="/wishlist">
                <LuHeart className="text-brown-900 cursor-pointer sm:text-3xl" />
              </Link>
            )}
          </div>
          <div
            className="bg-white p-2 rounded-full"
            onClick={() => setIsOpen(true)}
          >
            <LuEye className="text-brown-900  cursor-pointer sm:text-3xl" />
          </div>
        </div>

        {/* Button: Order 2 on mobile, 1 on md */}
        <div className="order-2 md:order-1">
          <Button
            label="ADD TO CART"
            color="blue"
            size="md"
            variant="solid"
            className="!bg-white !text-black !text-sm sm:!text-md sm:py-3 rounded-1 text-nowrap sm:me-4 flex items-center gap-[10px]"
            onClick={() => {
              router.push("your-cart");
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ShoppingCard;

// import React, { useState } from "react";
// import Button from "./Button";
// import { LuHeart } from "react-icons/lu";
// import { IoIosHeart } from "react-icons/io";

// import { LuEye } from "react-icons/lu";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import ProductDetails from "@/app/product/components/ProductDetails";
// const ShoppingCard = ({
//   image,
//   text,
//   className = "",
//   price,
//   isAddToCart = true,
//   imageheight,
//   heartbg,
//   isLink,
// }) => {
//   const router = useRouter();
//   const [isOpen, setIsOpen] = useState(false);

//   const handelChange = () => {
//     if (isLink) {
//       router.push("/product/1");
//     }
//   };

//   return (
//     <div className={`rounded-t-full bg-brown-500 ${className} mx-4`}>
//       <ProductDetails isOpen={isOpen} setIsOpen={setIsOpen} />

//       <div onClick={handelChange}>
//         <div
//           className={`p sm:h-[400px] xl:h-[340px] px-5 ${imageheight} ${
//             isAddToCart && "pt-5 rounded-t-full"
//           }`}
//         >
//           <img
//             src={image}
//             alt={text}
//             className="object-cover w-full h-full rounded-full border-6 border-brown-900"
//           />
//         </div>
//         <p className="text-center pt-5 pb-1 text-3xl xl:text-2xl">{text}</p>
//         {price && <div className="text-center text-xl ">${price}.00</div>}
//       </div>
//       <div className="flex flex-col md:flex-row justify-center items-center px-4 py-5">
//         {/* Icons: Order 1 on md and above */}
//         <div className="flex order-1 md:order-2 gap-2 mb-4 md:mb-0">
//           <div className="bg-white p-2 rounded-full">
//             {heartbg ? (
//               <IoIosHeart
//                 className="text-brown-900 pt-1 cursor-pointer"
//                 size={29}
//               />
//             ) : (
//               <Link href="/wishlist">
//                 <LuHeart
//                   className="text-brown-900 pt-1 cursor-pointer"
//                   size={29}
//                 />
//               </Link>
//             )}
//           </div>
//           <div
//             className="bg-white p-2 rounded-full"
//             onClick={() => setIsOpen(true)}
//           >
//             <LuEye className="text-brown-900  cursor-pointer" size={30} />
//           </div>
//         </div>

//         {/* Button: Order 2 on mobile, 1 on md */}
//         <div className="order-2 md:order-1">
//           <Button
//             label="ADD TO CART"
//             color="blue"
//             size="md"
//             variant="solid"
//             className="!bg-white !text-black py-3 rounded-1 text-nowrap me-4 flex items-center gap-[10px]"
//             onClick={() => {
//               router.push("your-cart");
//             }}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ShoppingCard;
