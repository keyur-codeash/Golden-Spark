import React from "react";

const BlogSkeleton = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-5 mt-10 animate-pulse">
      {/* Main Article Skeleton */}
      <div>
        <div className="h-[250px] md:h-[400px] w-full relative rounded-sm overflow-hidden bg-gray-300"></div>
        <div className="mt-4 space-y-3">
          <div className="h-4 w-32 bg-gray-300 rounded"></div>
          <div className="h-6 sm:h-8 w-3/4 bg-gray-300 rounded"></div>
          <div className="h-4 w-20 bg-gray-300 rounded"></div>
        </div>
      </div>

      {/* Side Articles Skeleton */}
      <div className="grid grid-cols-1 gap-5 md:gap-7 lg:gap-5">
        {[...Array(3)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col sm:flex-row gap-4 items-start animate-pulse"
          >
            <div className="relative w-full sm:w-3xs md:w-xs lg:w-[200px] h-[250px] lg:h-full md:h-[200px] sm:h-full rounded-sm overflow-hidden bg-gray-300"></div>
            <div className="flex-1 xl:pe-20 space-y-3 w-full">
              <div className="h-4 w-24 bg-gray-300 rounded"></div>
              <div className="h-6 sm:h-7 w-3/4 bg-gray-300 rounded"></div>
              <div className="h-4 w-20 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSkeleton;
