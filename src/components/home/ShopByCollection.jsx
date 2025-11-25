import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import Heading from "../Heading";
import CardCommon from "../CardCommon";
import Image from "next/image";
import { fetchShopByCallection } from "@/forntend/services/shopbyCalllection";

const ShopByCollection = () => {
  const [shapbycallection, setShapbycallection] = useState([]);

  const settings = {
    dots: true,
    arrows: false,
    infinite: false,
    speed: 500,
    slidesToShow: 7,
    slidesToScroll: 7,
    initialSlide: 0,
    appendDots: (dots) => (
      <div>
        <ul className="flex justify-center gap-3 mt-4">{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div className="w-[18px] h-[18px] rounded-full bg-brown-300 opacity-50"></div>
    ),
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
          dots: true,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 3,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          dots: true,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          dots: true,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchCallecttion = async () => {
      const response = await fetchShopByCallection();
      setShapbycallection(response.data);
    };

    fetchCallecttion();
  }, []);

  return (
    <div data-aos="fade-up">
      <div className="md:hidden lg:block">
        <div className="md:absolute -top-30 xl:bottom-25  pt-5 w-[80px] md:w-[103px] h-[113px]">
          <Image
            src="/images/side-icon-down.png"
            alt="auth image"
            width={103}
            height={113}
            className="object-cover"
          />
        </div>
      </div>
      <div className="shopByCollection">
        <div className="container mx-auto">
          {/* <div data-aos="fade-down"> */}
          <Heading className="text-brown-900" color="text-brown-800">
            Shop By Collection
          </Heading>

          <div className="flex justify-center pb-7">
            <p className="text-gray-500 md:text-sm xl:text-md xl:text-lg py-4 w-2xl text-center">
              A jewelry collection: where artistry meets emotion through
              exquisite Be the first new collections and exclusive offers.
              pieces.
            </p>
          </div>
          {/* </div> */}

          {shapbycallection?.length && (
            <div className="slider-container" data-aos="fade-up">
              <Slider {...settings}>
                {(() => {
                  const minItems = 8;
                  const items = [...shapbycallection];

                  while (
                    items.length < minItems &&
                    shapbycallection.length > 0
                  ) {
                    items.push(...shapbycallection);
                  }
                  const finalItems = items.slice(0, minItems);

                  return finalItems.map((item, index) => (
                    <CardCommon key={index} item={item} />
                  ));
                })()}
              </Slider>
            </div>
          )}
        </div>
        <div className="pt-20">
          <div className="bg-brown-1000 flex items-center justify-center text-white py-3">
            <Image
              src="/icons/star.svg"
              alt="auth image"
              width={50}
              height={50}
              className="object-cover w-8 xl:me-4"
            />
            <p className="text-[10px] md:text-lg lg:text-lg xl:text-xl">
              DISCOVER LATEST COLLECTIONS AND TOP DESIGNERS
            </p>
            <Image
              src="/icons/star.svg"
              alt="auth image"
              width={50}
              height={50}
              className="object-cover w-8 xl:mx-4"
            />
            <p className="hidden lg:block text-[10px] lg:text-lg xl:text-xl">
              DISCOVER LATEST COLLECTIONS AND TOP DESIGNERS
            </p>
            <Image
              src="/icons/star.svg"
              alt="auth image"
              width={50}
              height={50}
              className="object-cover w-8 hidden lg:block xl:ms-4"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopByCollection;
