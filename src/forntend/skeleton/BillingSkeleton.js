// SkeletonCart.tsx
"use client";
import React from "react";

export default function SkeletonCart({ items = 2, showPaymentUI = false }) {
  const arr = Array.from({ length: items });

  return (
    <div className="lg:me-4 select-none border-2 border-gray-200 bg-[#ffffff65] rounded-lg shadow-md overflow-hidden">
      {showPaymentUI && (
        <div className="animate-pulse">
          <div className="bg-red-400 hidden sm:block text-white p-4 text-2xl">
            <div className="h-6 w-28 bg-white/30 rounded" />
          </div>
          <div className="px-4 sm:px-9 pb-4 pt-7 sm:pt-12">
            <div className="w-full h-12 border-red-400 [#00000045] rounded-md flex items-center justify-center">
              <div className="h-5 w-40 bg-[#755c4e18] rounded" />
            </div>
          </div>
        </div>
      )}

      <div className="p-4 lg:pt-10 animate-pulse">
        <div className="md:px-4 md:pb-4 2xl:px-6 2xl:pb-0">
          {arr.map((_, i) => (
            <div key={i} className="sm:flex justify-between mb-6 border-b border-gray-200 pb-4">
              {/* Product Image */}
              <div className="md:w-1/2 lg:w-[40%] xl:w-[40%] 2xl:w-[50%] sm:pe-8 lg:pe-4">
                <div className="relative w-full md:w-full md:h-[200px] lg:h-[150px] sm:w-[170px] mx-auto xl:w-[150px] xl:h-[150px] 2xl:w-full 2xl:pe-10 2xl:h-[200px] h-[170px]">
                  <div className="absolute inset-0 bg-[#755c4e18] rounded-md" />
                </div>
              </div>

              {/* Product Details */}
              <div className="md:w-1/2 lg:w-[60%] xl:w-[60%] 2xl:w-[50%]">
                {/* Title */}
                <div className="pt-5 sm:p-0 space-y-2">
                  <div className="h-5 w-48 bg-[#755c4e18] rounded" />
                  <div className="h-4 w-32 bg-[#755c4e18] rounded" />
                </div>

                {/* Quantity */}
                <div className="flex items-center mt-4">
                  <div className="h-6 w-20 bg-[#755c4e18] rounded me-4" />
                  <div className="flex justify-center w-30 rounded-md items-center py-2 border border-gray-300 px-3 gap-3">
                    <div className="h-5 w-5 bg-[#755c4e18] rounded" />
                    <div className="h-5 w-8 bg-[#755c4e18] rounded" />
                    <div className="h-5 w-5 bg-[#755c4e18] rounded" />
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mt-5">
                  <div className="h-5 w-12 bg-[#755c4e18] rounded mb-3" />
                  <div className="flex flex-wrap gap-3">
                    {Array.from({ length: 3 }).map((__, idx) => (
                      <div
                        key={idx}
                        className="h-8 w-16 rounded-md border border-gray-200"
                      />
                    ))}
                  </div>
                </div>

                {/* Error placeholder (kept empty to avoid red flash) */}
                <div className="h-0 mt-2" />

                {/* Price */}
                <div className="flex items-center justify-between py-4">
                  <div className="h-5 w-16 bg-[#715c5013] rounded" />
                  <div className="h-5 w-20 bg-[#755c4e18] rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Price Breakdown */}
        <div className="mb-5 md:mx-6 md:mb-6 animate-pulse">
          <div className="space-y-4">
            <div className="flex justify-between">
              <div className="h-5 w-16 bg-[#755c4e18] rounded" />
              <div className="h-5 w-24 bg-[#755c4e18] rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-20 bg-[#755c4e18] rounded" />
              <div className="h-5 w-24 bg-[#755c4e18] rounded" />
            </div>
            <div className="flex justify-between">
              <div className="h-5 w-24 bg-[#755c4e18] rounded" />
              <div className="h-5 w-24 bg-[#755c4e18] rounded" />
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <div className="h-6 w-20 bg-[#755c4e18] rounded" />
              <div className="h-6 w-28 bg-gray-300 rounded" />
            </div>
            <div className="mt-3">
              <div className="h-12 w-full rounded bg-gray-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
