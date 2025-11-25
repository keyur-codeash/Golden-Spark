"use client";

import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import { monthfirstformatedDate } from "@/forntend/common/commonDateFormat";
import BlogSkeleton from "@/forntend/skeleton/blog/blogSkeleon";

const LatestArticle = ({ blogDetails = [], loading }) => {
  if (loading) {
    return <BlogSkeleton />;
  }
  const [mainArticle, ...restArticles] = blogDetails;

  if (!mainArticle) {
    return null;
  }

  return (
    <div className="latestArticle pt-10 md:pt-20">
      <div className="container mx-auto px-4">
        <div data-aos="fade-down">
          <Heading>Latest Article</Heading>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-5 mt-10">
          {/* Main Article */}
          <div>
            <div
              className="h-[250px] md:h-[400px] w-full relative rounded-sm overflow-hidden"
              data-aos="fade-right"
            >
              <Image
                src={mainArticle?.image}
                alt="main article"
                fill
                className="object-center"
              />
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm md:text-base">
                {monthfirstformatedDate(mainArticle?.createdAt)}
              </p>
              <h2 className="py-2 md:py-3 text-md sm:text-2xl xl:text-3xl font-medium">
                {mainArticle?.heading}
              </h2>
              <Link
                href={`/blog/${mainArticle?._id}`}
                className="text-gray-400 inline-block text-sm md:text-base border-b border-gray-400"
              >
                Read More
              </Link>
            </div>
          </div>

          {/* Side Articles */}
          <div
            className="grid grid-cols-1 gap-5 md:gap-7 lg:gap-5"
            data-aos="fade-left"
          >
            {restArticles &&
              restArticles.slice(0, 3).map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 items-start"
                >
                  <div className="relative w-full sm:w-3xs md:w-xs lg:w-[200px] h-[250px] lg:h-full md:h-[200px] sm:h-full rounded-sm overflow-hidden">
                    <Image
                      src={item?.image}
                      alt={`article-${index}`}
                      fill
                      className="object-center w-full h-full"
                    />
                  </div>
                  <div className="flex-1 xl:pe-20">
                    <p className="text-gray-400 text-sm sm:text-md md:text-base mb-1">
                      {monthfirstformatedDate(item?.createdAt)}
                    </p>
                    <h3 className="text-lg py-2 sm:text-xl font-semibold leading-snug">
                      {item?.heading}
                    </h3>
                    <Link
                      href={`/blog/${item?._id}`}
                      className="text-gray-400 text-sm md:text-base sm:text-sm inline-block border-b border-gray-400 mt-2"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestArticle;