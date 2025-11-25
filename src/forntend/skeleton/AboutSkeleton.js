"use client";
import React from "react";

function AboutSkeleton() {
  return (
    <div className="pt-10 lg:pt-28">
      <div className="container mx-auto">
        {[1, 2, 3].map((_, index) => {
          const isEven = index % 2 === 0;
          return (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-x-10 px-4 sm:px-0 mb-8 md:px-8 lg:px-4 xl:px-0 lg:pb-5 2xl:pb-7 animate-pulse"
            >
              {/* Image Skeleton */}
              <div
                className={`h-full min-h-96 ${
                  isEven ? "lg:order-2" : "lg:order-1"
                }`}
              >
                <div className="h-[250px] sm:h-[300px] lg:h-full w-full bg-[#bb937b17] rounded-xl"></div>
              </div>

              {/* Text Skeleton */}
              <div
                className={`space-y-4 ${isEven ? "lg:order-1" : "lg:order-2"}`}
              >
                {/* Heading */}
                <div className="h-8 w-1/2 bg-[#bb937b17] rounded"></div>
                {/* Subheading */}
                <div className="h-4 w-3/4 bg-[#bb937b17] rounded"></div>
                {/* Paragraph lines */}
                <div className="space-y-2">
                  <div className="h-3 w-full bg-[#bb937b17] rounded"></div>
                  <div className="h-3 w-11/12 bg-[#bb937b17] rounded"></div>
                  <div className="h-3 w-11/12 bg-[#bb937b17] rounded"></div>
                  <div className="h-3 w-11/12 bg-[#bb937b17] rounded"></div>
                  <div className="h-3 w-10/12 bg-[#bb937b17] rounded"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AboutSkeleton;
