import React from "react";

const ShoppingCardSkeleton = ({ className = "", imageheight }) => {
  return (
    <div data-aos="fade-up">
      <div className={`rounded-t-full bg-brown-500 ${className} mx-2 sm:mx-4`}>
        {/* Skeleton for image */}
        <div
          className={`p h-[200px] sm:h-[400px] xl:h-[340px] px-3 sm:px-5 animate-pulse ${imageheight} pt-3 sm:pt-5 rounded-t-full`}
        >
          <div className="w-full h-full rounded-full bg-gray-300 border-6 border-brown-500" />
        </div>

        {/* Skeleton for title */}
        <p className="text-center text-lg pt-5 pb-1 sm:text-3xl xl:text-2xl">
          <div className="h-4 sm:h-6 bg-gray-300 w-1/2 mx-auto rounded-md animate-pulse" />
        </p>

        {/* Skeleton for price */}
        <div className="text-center text-xl">
          <div className="h-4 bg-gray-300 w-1/4 mx-auto rounded-md animate-pulse" />
        </div>

        {/* Icons and button */}
        <div className="flex flex-col md:flex-row justify-center items-center px-4 pt-2 pb-5 sm:py-5">
          <div className="flex order-1 md:order-2 gap-2 mb-4 md:mb-0">
            <div className="bg-white p-3 rounded-full animate-pulse w-10 h-10" />
            <div className="bg-white p-3 rounded-full animate-pulse w-10 h-10" />
          </div>

          <div className="order-2 md:order-1">
            <div className="bg-white text-black text-sm sm:text-md sm:py-3 rounded-1 text-nowrap sm:me-4 flex items-center gap-[10px] px-6 py-2 animate-pulse">
              <div className="h-4 w-20 bg-gray-300 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShoppingCardSkeleton;
