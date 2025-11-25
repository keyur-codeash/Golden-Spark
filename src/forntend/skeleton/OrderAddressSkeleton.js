import React from "react";

function OrderAddressSkeleton() {
  return (
    <div className="border border-gray-300  w-full rounded-sm p-6 sm:w-1/2 mt-5 sm:mt-10 animate-pulse">
      {/* Radio + Title */}
      <div className="flex items-center pb-3">
        <div className="h-5 w-5 rounded-full bg-[#755c4e13]"></div>
        <div className="h-6 w-32 bg-[#755c4e13] rounded ms-4"></div>
      </div>

      {/* Address block */}
      <div className="ps-9">
        <div className="h-4 w-3/4 bg-[#755c4e13] rounded mb-2"></div>
        <div className="h-4 w-2/3 bg-[#755c4e13] rounded mb-2"></div>

        {/* Pay on delivery text */}
        <div className="pt-4">
          <div className="relative pl-6">
            <span className="absolute left-0 top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-[#755c4e13]"></span>
            <div className="h-4 w-48 bg-[#755c4e13] rounded"></div>
          </div>

          {/* Button skeleton */}
          <div className="pt-5">
            <div className="h-10 w-40 bg-[#755c4e13] rounded-sm"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderAddressSkeleton;
