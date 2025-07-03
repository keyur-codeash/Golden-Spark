"use client";
import Button from "@/components/Button";
import Image from "next/image";
import React, { useState } from "react";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { HiOutlineArrowLeft } from "react-icons/hi";

const ProductTotalCard = ({
  product = {
    id: 1,
    title: "Stone Pointed Toe Rings",
    price: 578.0,
    sizes: ["S", "M", "L"],
    imageUrl: "/images/shop_by_one.png",
  },
  products = [
    {
      id: 1,
      title: "Stone Pointed Toe Rings 1",
      price: 578.0,
      sizes: ["S", "M", "L"],
      imageUrl: "/images/shop_by_one.png",
    },
  ],
  isPaymnetUI = false,
  btntext = "PLACE ORDER",
  navigate = "payment",
}) => {
  // If products array is provided, use that instead of single product

  const displayMultipleProducts = products.length > 0;

  // State for quantities (for multiple products)
  const [quantities, setQuantities] = useState(
    products.reduce((acc, p) => ({ ...acc, [p.id]: 1 }), {})
  );

  // State for selected sizes (for multiple products)
  const [selectedSizes, setSelectedSizes] = useState(
    products.reduce((acc, p) => ({ ...acc, [p.id]: p.sizes[0] }), {})
  );

  // State for single product mode
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);

  const deliveryFee = 578.0;
  const tax = 578.0;
  const router = useRouter();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      if (displayMultipleProducts) {
        setQuantities((prev) => ({ ...prev, [productId]: newQuantity }));
      } else {
        setQuantity(newQuantity);
      }
    }
  };

  const handleSizeChange = (productId, size) => {
    if (displayMultipleProducts) {
      setSelectedSizes((prev) => ({ ...prev, [productId]: size }));
    } else {
      setSelectedSize(size);
    }
  };

  // Calculate totals
  const calculateSubtotal = () => {
    if (displayMultipleProducts) {
      return products.reduce(
        (sum, p) => sum + p.price * (quantities[p.id] || 1),
        0
      );
    }
    return product.price * quantity;
  };

  const subtotal = calculateSubtotal();
  const total = subtotal + deliveryFee + tax;

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
              onClick={() => router.push("your-cart")}
            />
          </div>
        </div>
      )}

      <div className="p-4 lg:pt-10">
        <div className="md:px-4 md:pb-4 2xl:px-6 2xl:pb-6">
          {/* Render multiple products or single product */}
          {displayMultipleProducts ? (
            products.map((prod) => (
              <div
                key={prod.id}
                className="sm:flex justify-between mb-6 border-b"
              >
                <div className="md:w-1/2 lg:w-[40%] xl:w-[40%] 2xl:w-[50%] sm:pe-8 lg:pe-4">
                  <div className="relative w-full md:w-full md:h-[200px] lg:h-[150px] sm:w-[170px] mx-auto xl:w-[150px] xl:h-[150px] 2xl:w-full 2xl:pe-10 2xl:h-[200px] h-[170px]">
                    <Image
                      src={prod.imageUrl}
                      alt={prod.title}
                      fill
                      className="object-center w-full rounded-md"
                    />
                  </div>
                </div>
                <div className="md:w-1/2 lg:w-[60%] xl:w-[60%] 2xl:w-[50%]">
                  <div className="text-xl pt-5 sm:p-0">{prod.title}</div>
                  <div className="flex items-center">
                    <p className="text-xl py-4 pe-5">Quantity:</p>
                    <div>
                      <div className="flex justify-center w-30 rounded-md items-center py-1 border px-2">
                        <p
                          className="text-xl cursor-pointer"
                          onClick={() =>
                            handleQuantityChange(
                              prod.id,
                              quantities[prod.id] - 1
                            )
                          }
                        >
                          <FiMinus />
                        </p>
                        <p className="px-4 text-xl">
                          {quantities[prod.id] || 1}
                        </p>
                        <p
                          className="text-xl cursor-pointer"
                          onClick={() =>
                            handleQuantityChange(
                              prod.id,
                              quantities[prod.id] + 1
                            )
                          }
                        >
                          <FiPlus />
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Size Selector */}
                  <div>
                    <h3 className="text-lg xl:text-xl text-gray-700 mb-3">
                      Size
                    </h3>
                    <div className="flex space-x-3">
                      {prod.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => handleSizeChange(prod.id, size)}
                          className={`px-5 py-1 rounded-md ${
                            selectedSizes[prod.id] === size
                              ? "bg-yellow-800 text-white"
                              : "text-gray-800 border-1 cursor-pointer"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="text-xl flex items-center justify-between py-4">
                    <p>Price</p>
                    <p>${prod.price.toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="sm:flex justify-between">
              <div className="md:w-1/2 lg:w-[40%] xl:w-[40%] 2xl:w-[50%] sm:pe-8 lg:pe-4">
                <div className="relative w-full md:w-full md:h-[200px] lg:h-[150px] sm:w-[170px] mx-auto xl:w-[150px] xl:h-[150px] 2xl:w-full 2xl:pe-10 2xl:h-[200px] h-[170px]">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    className="object-center w-full rounded-md"
                  />
                </div>
              </div>
              <div className="md:w-1/2 lg:w-[60%] xl:w-[60%] 2xl:w-[50%]">
                <div className="text-xl pt-5 sm:p-0">{product.title}</div>
                <div className="flex items-center">
                  <p className="text-xl py-4 pe-5">Quantity:</p>
                  <div>
                    <div className="flex justify-center w-30 rounded-md items-center py-1 border px-3">
                      <p
                        className="text-xl cursor-pointer"
                        onClick={() =>
                          handleQuantityChange(product.id, quantity - 1)
                        }
                      >
                        <FiMinus />
                      </p>
                      <p className="px-4 text-xl">{quantity}</p>
                      <p
                        className="text-xl cursor-pointer"
                        onClick={() =>
                          handleQuantityChange(product.id, quantity + 1)
                        }
                      >
                        <FiPlus />
                      </p>
                    </div>
                  </div>
                </div>

                {/* Size Selector */}
                <div>
                  <h3 className="text-lg xl:text-xl text-gray-700 mb-3">
                    Size
                  </h3>
                  <div className="flex space-x-3">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => handleSizeChange(product.id, size)}
                        className={`px-7 py-2 rounded-md ${
                          selectedSize === size
                            ? "bg-yellow-800 text-white"
                            : "text-gray-800 border-1 cursor-pointer"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-xl flex items-center justify-between py-4">
                  <p>Price</p>
                  <p>${product.price.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* <div className="divider border-t md:mx-6"></div> */}

        {/* Price Breakdown */}
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
              <span className="">Tax</span>
              <span className="">${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pt-4 border-t">
              <span className="text-lg font-bold">Total</span>
              <span className="text-lg font-bold">${total.toFixed(2)}</span>
            </div>
            <div>
              <Button
                label={btntext}
                size="md"
                variant="solid"
                className="!bg-yellow-800 w-full !rounded-0 py:3 sm:py-3.5 mt-3 flex items-center gap-[10px]"
                onClick={() => {
                  router.push(navigate);
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTotalCard;

// "use client";
// import Button from "@/components/Button";
// import Image from "next/image";
// import React, { useState } from "react";
// import { FiMinus, FiPlus } from "react-icons/fi";
// import { useRouter } from "next/navigation";
// import { HiOutlineArrowLeft } from "react-icons/hi";

// const ProductTotalCard = ({
//   product = {
//     id: 1,
//     title: "Stone Pointed Toe Rings",
//     price: 578.0,
//     sizes: ["S", "M", "L"],
//     imageUrl: "/images/shop_by_one.png"
//   },
//   isPaymnetUI = false,
//   btntext = "PLACE ORDER",
//   navigate = "payment"
// }) => {
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
//   const deliveryFee = 578.0;
//   const tax = 578.0;
//   const router = useRouter();

//   const handleQuantityChange = (newQuantity) => {
//     if (newQuantity > 0) {
//       setQuantity(newQuantity);
//     }
//   };

//   const total = product.price * quantity + deliveryFee + tax;

//   return (
//     <div className="mx-auto select-none border-2 border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
//       {isPaymnetUI && (
//         <div>
//           <div className="bg-black hidden sm:block text-white p-4 text-2xl">
//             ZView
//           </div>
//           <div className="px-4 sm:px-9 pb-4 pt-7 sm:pt-12">
//             <Button
//               icon={<HiOutlineArrowLeft size={24} className="me-2" />}
//               label="Back TO CART"
//               variant="outline"
//               className="px-3 py-3 w-full border !text-black border-black"
//               onClick={() => router.push("your-cart")}
//             />
//           </div>
//         </div>
//       )}

//       <div className="p-3">
//         <div className="md:p-4 2xl:p-6">
//           <div className="sm:flex justify-between ">
//             <div className="md:w-1/2 lg:w-[40%] xl:w-[40%] 2xl:w-[50%] sm:pe-8 lg:pe-4">
//               <div className="relative w-full md:w-full md:h-[200px] lg:h-[150px] sm:w-[170px] mx-auto xl:w-[150px] xl:h-[150px] 2xl:w-full 2xl:pe-10 2xl:h-[200px] h-[170px]">
//                 <Image
//                   src={product.imageUrl}
//                   alt={product.title}
//                   fill
//                   className="object-center w-full rounded-md"
//                 />
//               </div>
//             </div>
//             <div className=" md:w-1/2  lg:w-[60%]  xl:w-[60%] 2xl:w-[50%]">
//               <div className="text-xl pt-5 sm:p-0">{product.title}</div>
//               <div className="flex items-center ">
//                 <p className="text-xl  py-4 pe-5">Quantity:</p>
//                 <div>
//                   <div className="flex justify-center w-30 rounded-md items-center py-1 border px-3">
//                     <p
//                       className="text-xl cursor-pointer"
//                       onClick={() => handleQuantityChange(quantity - 1)}
//                     >
//                       <FiMinus />
//                     </p>
//                     <p className="px-4 text-xl">{quantity}</p>
//                     <p
//                       className="text-xl cursor-pointer"
//                       onClick={() => handleQuantityChange(quantity + 1)}
//                     >
//                       <FiPlus />
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Size Selector */}
//               <div>
//                 <h3 className="text-lg xl:text-xl  text-gray-700 mb-3">Size</h3>
//                 <div className="flex space-x-3">
//                   {product.sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`px-7 py-2 rounded-md ${
//                         selectedSize === size
//                           ? "bg-yellow-800 text-white"
//                           : " text-gray-800 border-1 cursor-pointer"
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className=" text-xl flex items-center justify-between py-4">
//                 <p>Price</p>
//                 <p>${product.price.toFixed(2)}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="divider border-t md:mx-6"></div>
//         {/* Price Breakdown */}
//         <div className="my-5 md:m-6">
//           <div className="space-y-4 text-xl ">
//             <div className="flex justify-between">
//               <span className="">Items</span>
//               <span className="">${(product.price * quantity).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <p className="">Delivery</p>
//               <span className="">${deliveryFee.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="">Tax</span>
//               <span className="">${tax.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between pt-4 border-t">
//               <span className="text-lg font-bold">Total</span>
//               <span className="text-lg font-bold">${total.toFixed(2)}</span>
//             </div>
//             <div>
//               <Button
//                 label={btntext}
//                 size="md"
//                 variant="solid"
//                 className="!bg-yellow-800 w-full !rounded-0 py:3 sm:py-3.5 mt-7 flex items-center gap-[10px]"
//                 onClick={() => {
//                   router.push(navigate);
//                 }}
//               />{" "}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductTotalCard;

// "use client";
// import Button from "@/components/Button";
// import Image from "next/image";
// import React, { useState } from "react";
// import { FiMinus, FiPlus } from "react-icons/fi";
// import { useRouter } from "next/navigation";
// import { HiOutlineArrowLeft } from "react-icons/hi";

// const data = [
//   {
//     id: 1,
//     title: "Stone Pointed Toe Rings",
//     price: 578.0,
//     sizes: ["S", "M", "L"],
//   },
//   {
//     id: 2,
//     title: "Stone Pointed Toe Rings 1",
//     price: 178.0,
//     sizes: ["S", "M", "L"],
//   },
// ];

// const ProductTotalCard = (isPaymnetUI, btntext, navigate) => {
//   const [quantity, setQuantity] = useState(1);
//   const [selectedSize, setSelectedSize] = useState(sizes[0]);
//   const deliveryFee = 578.0;
//   const tax = 578.0;
//   const router = useRouter();

//   const handleQuantityChange = (newQuantity) => {
//     if (newQuantity > 0) {
//       setQuantity(newQuantity);
//     }
//   };

//   const total = price * quantity + deliveryFee + tax;

//   return (
//     <div className="mx-auto select-none border-2 border-gray-200 bg-white rounded-lg shadow-md overflow-hidden">
//       {isPaymnetUI && (
//         <div>
//           <div className="bg-black hidden sm:block text-white p-4 text-2xl">
//             Cart View
//           </div>
//           <div className="px-4 sm:px-9 pb-4 pt-7 sm:pt-12">
//             <Button
//               icon={<HiOutlineArrowLeft size={24} className="me-2" />}
//               label="Back  TO CART"
//               variant="outline"
//               className="px-3 py-3 w-full border !text-black border-black"
//               onClick={() => router.push("your-cart")}
//             />
//           </div>
//         </div>
//       )}
//       {/* Product Header */}
//       {/* <div className="p-6 border-b">
//         <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
//       </div> */}

//       {/* Quantity Selector */}
//       <div className="p-3">
//         <div className="md:p-4 2xl:p-6">
//           <div className="sm:flex justify-between ">
//             <div className="md:w-1/2 lg:w-[40%] xl:w-[40%] 2xl:w-[50%] sm:pe-8 lg:pe-4">
//               <div className="relative w-full md:w-full md:h-[200px] lg:h-[150px] sm:w-[170px] mx-auto xl:w-[150px] xl:h-[150px] 2xl:w-full 2xl:pe-10 2xl:h-[200px] h-[170px]">
//                 <Image
//                   src="/images/shop_by_one.png"
//                   alt="product"
//                   fill
//                   className="object-center w-full rounded-md"
//                 />
//               </div>
//             </div>
//             <div className=" md:w-1/2  lg:w-[60%]  xl:w-[60%] 2xl:w-[50%]">
//               <div className="text-xl pt-5 sm:p-0">Stone Pointed Toe Rings</div>
//               <div className="flex items-center ">
//                 <p className="text-xl  py-4 pe-5">Quantity:</p>
//                 <div>
//                   <div className="flex justify-center w-30 rounded-md items-center py-1 border px-3">
//                     <p
//                       className="text-xl cursor-pointer"
//                       onClick={() => setQuantity(quantity - 1)}
//                     >
//                       <FiMinus />
//                     </p>
//                     <p className="px-4 text-xl">{quantity}</p>
//                     <p
//                       className="text-xl cursor-pointer"
//                       onClick={() => setQuantity(quantity + 1)}
//                     >
//                       <FiPlus />
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* Size Selector */}
//               <div>
//                 <h3 className="text-lg xl:text-xl  text-gray-700 mb-3">Size</h3>
//                 <div className="flex space-x-3">
//                   {sizes.map((size) => (
//                     <button
//                       key={size}
//                       onClick={() => setSelectedSize(size)}
//                       className={`px-7 py-2 rounded-md ${
//                         selectedSize === size
//                           ? "bg-yellow-800 text-white"
//                           : " text-gray-800 border-1 cursor-pointer"
//                       }`}
//                     >
//                       {size}
//                     </button>
//                   ))}
//                 </div>
//               </div>

//               <div className=" text-xl flex items-center justify-between py-4">
//                 <p>Price</p>
//                 <p>${price.toFixed(2)}</p>
//               </div>
//             </div>
//           </div>
//         </div>
//         <div className="divider border-t md:mx-6"></div>
//         {/* Price Breakdown */}
//         <div className="my-5 md:m-6">
//           <div className="space-y-4 text-xl ">
//             <div className="flex justify-between">
//               <span className="">Items</span>
//               <span className="">${(price * quantity).toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <p className="">Delivery</p>
//               <span className="">${deliveryFee.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between">
//               <span className="">Tax</span>
//               <span className="">${tax.toFixed(2)}</span>
//             </div>
//             <div className="flex justify-between pt-4 border-t">
//               <span className="text-lg font-bold">Total</span>
//               <span className="text-lg font-bold">${total.toFixed(2)}</span>
//             </div>
//             <div>
//               <Button
//                 label={btntext || "PLACE ORDER"}
//                 size="md"
//                 variant="solid"
//                 className="!bg-yellow-800 w-full !rounded-0 py:3 sm:py-3.5 mt-7 flex items-center gap-[10px]"
//                 onClick={() => {
//                   router.push(navigate ? navigate : "payment");
//                 }}
//               />{" "}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ProductTotalCard;
