"use client";
import React from "react";
import Heading from "../Heading";
import Image from "next/image";

import Link from "next/link";

export const instagram = [
  {
    postUrl:
      "https://www.instagram.com/p/CEuqUvxBqGB/?utm_source=ig_web_button_share_sheet",
    image: "/images/instagram_one.png",
  },
  {
    postUrl:
      "https://www.instagram.com/p/CEuqUvxBqGB/?utm_source=ig_web_button_share_sheet",
    image: "/images/instagram_two.png",
  },
  {
    postUrl:
      "https://www.instagram.com/p/CEuqUvxBqGB/?utm_source=ig_web_button_share_sheet",
    image: "/images/instagram_three.png",
  },
  {
    postUrl:
      "https://www.instagram.com/p/CEuqUvxBqGB/?utm_source=ig_web_button_share_sheet",
    image: "/images/instagram_four.png",
  },
  {
    postUrl:
      "https://www.instagram.com/p/CEuqUvxBqGB/?utm_source=ig_web_button_share_sheet",
    image: "/images/instagram_five.png",
  },
];

const Instagram = () => {
  return (
    <div className="instagram relative pt-10 ">
      <div className=" mx-auto px-4 md:px-0 lg:px-0">
        <div data-aos="fade-down">
          <Heading className="text-brown-900" color="text-brown-800">
            Instagram
          </Heading>

          <div className="flex justify-center pb-7">
            <p className="text-gray-500 md:text-sm xl:text-md xl:text-lg py-4 w-2xl text-center">
              All the business growth and profit revolve around effective catchy
              marketing sales always in the limelight...
            </p>
          </div>
        </div>
        <div data-aos="fade-right">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-5 sm:gap-10 md:gap-0 xl:grid-cols-5">
            {instagram?.map((item, index) => {
              return (
                <div className="relative sm:w-full h-[288px] md:h-[200px] lg:h-[230px] xl:h-[320px]">
                  <Link href={item.postUrl}>
                    <Image
                      src={item.image}
                      alt="auth image"
                      fill
                      className="object-cover"
                    />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Instagram;
