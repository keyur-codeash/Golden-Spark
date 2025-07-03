import React from "react";
import Heading from "../Heading";
import ProductCommonCard from "../ProductCommonCard";
import { journalData } from "@/data/data";
import Slider from "react-slick/lib/slider";

function OurJournals() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-2 mt-4">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-[16px] h-[16px] rounded-full bg-white"></div>
    ),
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="shopByCollection relative py-10 lg:py-20 xl:pt-30">
      <div className="container mx-auto">
        <Heading className="text-brown-900" color="text-brown-800">
          From Our Journals
        </Heading>

        <div className="flex justify-center pb-7">
          <p className="text-gray-500 md:text-sm xl:text-md xl:text-lg py-4 w-2xl text-center">
            These blogs provide information about the history of these business
            Ambistat proskade tempofiering, reamatisk megaosmsos.
          </p>
        </div>
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-0"> */}
        <Slider {...settings}>
          {journalData.map((item, index) => (
            <ProductCommonCard key={index} item={item} />
          ))}
        </Slider>
      </div>
      <div className="absolute md:top-auto bottom-0 right-0 xl:bottom-0 w-[70px] md:w-[103px] h-[113px]">
        <img
          src="/images/side-icon-up.png"
          alt="auth image"
          className="object-cover"
        />
      </div>
      {/* </div> */}
    </div>
  );
}

export default OurJournals;
