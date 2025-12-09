import React from "react";

const CategoryCardSkeleton = () => {
  return (
    <div className="mt-4 overflow-auto no-scrollbar h-auto max-h-[calc(100vh-260px)] space-y-2">
      {[1, 2, 3, 4, 5].map((item) => (
        <div
          key={item}
          className="rounded-lg bg-white border border-gray-200 mb-3 shadow-sm animate-pulse"
        >
          <div className="pl-6 pr-4 py-4 flex flex-col space-y-3">
            {/* Top Section */}
            <div className="flex justify-between items-start">
              <div className="min-w-0 flex-1">
                <div className="h-5 bg-[#bb937b17] rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-[#bb937b17] rounded w-1/2"></div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
              <div className="h-5 w-16 bg-[#bb937b17] rounded"></div>
              <div className="flex space-x-2">
                <div className="h-8 w-8 bg-[#bb937b17] rounded-full"></div>
                <div className="h-8 w-8 bg-[#bb937b17] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CategoryCardSkeleton;
