"use client";
import Heading from "@/components/Heading";
import Image from "next/image";
import React from "react";

function AboutDetails() {
  const aboutUsData = [
    {
      heading: "Our Story",
      subHeading: "THE HIGH STRESS FAVOUTIRE",
      text: "we believe jewellery is more than adornment — it's an expression of identity, emotion, and timeless beauty. Our journey began with a simple idea: to create pieces that speak without words, that carry meaning, and that become part of your story. Rooted in craftsmanship and inspired by the elegance of everyday moments, our designs blend classic artistry with modern sensibility. Whether it's a delicate ring, a statement necklace, or an heirloom in the making, each piece is thoughtfully crafted to the moments that matter most. We believe that jewellery is more than just an accessory ...",
      image: "/images/about_one.png",
      textOrder: 1,
      imgOrder: 2,
    },
    {
      heading: "Who we Are?",
      subHeading: "THE HIGH STRESS FAVOUTIRE",
      text: "we believe jewellery is more than adornment — it's an expression of identity, emotion, and timeless beauty. Our journey began with a simple idea: to create pieces that speak without words, that carry meaning, and that become part of your story. Rooted in craftsmanship and inspired by the elegance of everyday moments, our designs blend classic artistry with modern sensibility. Whether it's a delicate ring, a statement necklace, or an heirloom in the making, each piece is thoughtfully crafted to the moments that matter most. We believe that jewellery is more than just an accessory ...",
      image: "/images/about_two.png",
      textOrder: 2,
      imgOrder: 1,
    },
    {
      heading: "Our Mission",
      subHeading: "THE HIGH STRESS FAVOUTIRE",
      text: "we believe jewellery is more than adornment — it's an expression of identity, emotion, and timeless beauty. Our journey began with a simple idea: to create pieces that speak without words, that carry meaning, and that become part of your story. Rooted in craftsmanship and inspired by the elegance of everyday moments, our designs blend classic artistry with modern sensibility. Whether it's a delicate ring, a statement necklace, or an heirloom in the making, each piece is thoughtfully crafted to the moments that matter most. We believe that jewellery is more than just an accessory ...",
      image: "/images/about_three.png",
      textOrder: 1,
      imgOrder: 2,
    },
  ];

  return (
    <div className=" pt-10 lg:pt-28">
      <div className="container">
        {aboutUsData.map((item, index) => {
          return (
            <div
              key={index}
              className="grid grid-cols-1 lg:grid-cols-2 gap-5 lg:gap-x-10 px-4  sm:px-0 mb-8 md:px-8 lg:px-4 xl:px-0 lg:pb-5 2xl:pb-7"
            >
              {/* Image Block */}
              <div
                className={`h-full ${
                  item.imgOrder === 1 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <div className="h-[250px] sm:h-[300px] lg:h-full w-full relative">
                  <Image
                    src={item.image}
                    alt="about"
                    fill
                    className="object-cover h-full w-full rounded-xl "
                  />
                </div>
              </div>

              {/* Text Block */}
              <div
                className={`lg:pb-15 xl:pb-20 2xl:pb-25 ${
                  item.textOrder === 1 ? "lg:order-1" : "lg:order-2"
                }`}
              >
                <Heading className="text-start !px-0">{item.heading}</Heading>
                <p className="relative pl-8 py-5 text-nowrap tracking-widest opacity-70 text-sm md:text-lg  before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-7 before:h-[2px] before:bg-gray-400">
                  {item.subHeading}
                </p>
                <p className="text-gray-500 text-sm md:text-lg lg:text-sm 2xl:text-xl">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AboutDetails;
