// SkeletonShoppingCard.tsx
"use client";
import React from "react";

export default function SkeletonShoppingCard({ items = 3 }) {
  const arr = Array.from({ length: items });

  return (
    <>
      {arr.map((_, index) => (
        <div key={index}>
          {" "}
          {/* Add the key here */}
          <div className="rounded-t-full bg-[#bb937b17] mx-2 sm:mx-4 animate-pulse ">
            {/* Image placeholder */}
            <div className="h-[200px] sm:h-[400px] xl:h-[340px] px-3 sm:px-5 pt-5">
              <div className="w-full h-full rounded-full border-6 border-[#bb937b1e] bg-[#bb937b17]" />
            </div>

            {/* Title */}
            <div className="text-center pt-5 pb-1">
              <div className="h-5 sm:h-6 w-32 sm:w-40 bg-[#bb937b17] rounded mx-auto" />
            </div>

            {/* Price */}
            <div className="text-center mb-2">
              <div className="h-4 w-20 bg-[#bb937b17] rounded mx-auto" />
            </div>

            {/* Buttons + Icons */}
            <div className="flex flex-col md:flex-row justify-center items-center px-4 pt-2 pb-5 gap-3">
              {/* Wishlist + Eye icons */}
              <div className="flex order-1 md:order-2 gap-2">
                <div className="bg-white p-3 rounded-full">
                  <div className="h-5 w-5 bg-[#bb937b17] rounded-full" />
                </div>
                <div className="bg-white p-3 rounded-full">
                  <div className="h-5 w-5 bg-[#bb937b17] rounded-full" />
                </div>
              </div>

              {/* Add to cart button */}
              <div className="order-2 md:order-1 w-full md:w-auto">
                <div className="h-10  w-full sm:w-36 bg-white rounded text-sm sm:text-md" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
