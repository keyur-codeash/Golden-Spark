"use client";

import Heading from "@/components/Heading";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function LatestArticle() {
  const articles = [
    {
      img: "/images/latest_article_one.png",
      date: "November 03, 2025",
      heading:
        "Silver Chains for Women: A Delicate and Elegant Fashion Statement",
      isFeatured: true,
    },
    {
      img: "/images/latest_article_two.png",
      date: "November 03, 2025",
      heading: "Diamond Arrives at the New Paris Flagship Store",
      isFeatured: false,
    },
    {
      img: "/images/latest_article_three.png",
      date: "November 03, 2025",
      heading: "The Art of Handcrafted Diamond Necklaces",
      isFeatured: false,
    },
    {
      img: "/images/latest_article_four.png",
      date: "November 03, 2025",
      heading: "Explore Our New Collection of Engagement Rings",
      isFeatured: false,
    },
  ];

  const featuredArticle = articles.find((article) => article.isFeatured);
  const otherArticles = articles.filter((article) => !article.isFeatured);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div data-aos="fade-up">
      <div className="latestArticle pt-10 md:pt-20">
        <div className="container mx-auto px-4">
          <Heading>Latest Article</Heading>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-5 mt-10">
            {/* Main Large Article */}
            <div>
              <div className="h-[250px] md:h-[400px] w-full relative rounded-sm overflow-hidden">
                <Image
                  src={featuredArticle.img}
                  alt="main article"
                  fill
                  className="object-center"
                />
              </div>
              <div className="mt-4">
                <p className="text-gray-400 text-sm">{featuredArticle.date}</p>
                <h2 className="py-3 text-md sm:text-2xl xl:text-3xl font-medium">
                  {featuredArticle.heading}
                </h2>
                <Link
                  href="#"
                  className="text-gray-400 inline-block text-sm border-b border-gray-400"
                >
                  Read More
                </Link>
              </div>
            </div>

            {/* Side Grid Articles */}
            <div className="grid grid-cols-1 gap-5 md:gap-7 lg:gap-5">
              {otherArticles.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row gap-4 items-start"
                >
                  <div className="relative w-full sm:w-3xs md:w-xs lg:w-[200px] h-[250px] lg:h-full md:h-[200px] sm:h-full rounded-sm overflow-hidden">
                    <Image
                      src={item.img}
                      alt={`article-${index}`}
                      fill
                      className="object-center w-full h-full"
                    />
                  </div>
                  <div className="flex-1 xl:pe-20">
                    <p className="text-gray-400 text-sm lg:text-sm sm:text-md mb-1">
                      {item.date}
                    </p>
                    <h3 className="text-lg py-2 sm:text-xl font-semibold leading-snug">
                      {item.heading}
                    </h3>
                    <Link
                      href="#"
                      className="text-gray-400 text-sm lg:text-sm sm:text-md  inline-block border-b border-gray-400 mt-2"
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
    </div>
  );
}

export default LatestArticle;
