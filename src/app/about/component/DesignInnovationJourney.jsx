"use client";
import React from "react";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function DesignInnovationJourney() {
  const designInnovationJourney = [
    {
      img: "./icons/about_one.svg",
      heading: "Design",
      text: "Diamond Vine Climber Earrings A striking display of diamonds scales...",
    },
    {
      img: "./icons/about_two.svg",
      heading: "Innovation",
      text: "Diamond Vine Climber Earrings A striking display of diamonds scales...",
    },
    {
      img: "./icons/about_three.svg",
      heading: "Journey",
      text: "Diamond Vine Climber Earrings A striking display of diamonds scales...",
    },
  ];

  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    initialSlide: 0,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-3">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-[18px] h-[18px] rounded-full bg-white opacity-70"></div>
    ),
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  };

  return (
    <div className="designInnovationJourney relative">
      <div className="container mx-auto">
        <div className="relative w-full pb-10 sm:py-10 md:py-15 lg:20">
          {/* Background Image */}
          <div className="absolute inset-0 mx-4 sm:mx-0 bg-[url('/images/about-bg.png')] rounded-lg bg-cover bg-center z-0" />

          {/* Dark Overlay */}
          <div className="absolute inset-0 mx-4 sm:mx-0 bg-black rounded-lg opacity-60 z-10" />

          {/* Content */}
          <div className="relative z-20 h-full pb-5 sm:pb-0">
            <Slider {...settings}>
              {designInnovationJourney.map((item, index) => (
                <div key={index} className="px-4">
                  <div className="flex flex-col items-center px-2 pb-4 pt-10 sm:py-8">
                    {/* Circle Image Container */}
                    <div className="h-[125px] w-[125px] rounded-full bg-yellow-800 relative overflow-hidden">
                      <Image
                        src={item.img}
                        alt={item.heading}
                        fill
                        className="object-contain p-6"
                      />
                    </div>

                    {/* Text Content */}
                    <div className="text-center">
                      <p className="relative text-3xl pt-4 text-white pb-3 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:-translate-x-1/2 after:border-gray-300 after:rounded-xl after:w-14 after:border-b-2">
                        {item.heading}
                      </p>
                      <p className="sm:text-lg text-white pt-5">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DesignInnovationJourney;