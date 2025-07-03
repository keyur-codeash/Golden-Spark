"use client";
import Button from "@/components/Button";
import Heading from "@/components/Heading";
import { behindTheBrands } from "@/data/data";
import Image from "next/image";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const BehindTheBrands = () => {
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
      <div className="w-[18px] h-[18px] rounded-full bg-white"></div>
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
    <div className="instagram relative pt-10 lg:pt-25">
      <div className="container mx-auto">
        <Heading>Behind The Brands</Heading>
        <div className="flex justify-center sm:pb-7">
          <p className="text-gray-500 text-sm md:text-sm xl:text-md xl:text-lg py-4 px-4 w-6xl text-center">
            We are a female-founded, 100% woman-led team of collaborative
            dreamers who value innovation, curiosity and free-thinking
            fearlessness in everything that we do. We take immeasurable pride in
            our work, intentionally stitching love into the very fiber and
            fabric of our designs...
          </p>
        </div>

        <Slider {...settings} className="pb-5 sm:pb-10">
          {behindTheBrands.map((item, index) => (
            <div key={index} className="px-4">
              <div className="text-center">
                <div className="relative w-full h-[300px] xl:h-[400px] mx-auto">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-center rounded-lg"
                  />
                </div>
                <div className="pt-6">
                  <h2 className="text-2xl xl:text-3xl pb-2">{item.title}</h2>
                  <p className="text-md sm:text-lg text-center text-gray-500 whitespace-pre-line">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default BehindTheBrands;