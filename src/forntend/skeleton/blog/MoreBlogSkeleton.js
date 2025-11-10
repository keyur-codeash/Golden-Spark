import React from "react";

function MoreBlogSkeleton() {
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-5 mt-6 md:mt-10 md:px-4 xl:px-0">
  {[...Array(3)].map((_, index) => (
    <div key={index} className="px-4 sm:px-0 animate-pulse">
      <div className="h-[250px] md:h-[250px] xl:h-[320px] w-full relative rounded-sm overflow-hidden bg-gray-300"></div>
      <div className="mt-4 space-y-3">
        <div className="h-4 w-32 bg-gray-300 rounded"></div>
        <div className="h-6 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-4 w-24 bg-gray-300 rounded"></div>
      </div>
    </div>
  ))}
</div>

  );
}

export default MoreBlogSkeleton;
