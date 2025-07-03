import React from "react";
import Heading from "../Heading";
import Image from "next/image";
import { instagram } from "@/data/data";

function Instagram() {
  return (
    <div className="instagram relative pt-10 ">
      <div className="container mx-auto px-4 lg:px-0">
        <Heading className="text-brown-900" color="text-brown-800">
          Instagram
        </Heading>

        <div className="flex justify-center pb-7">
          <p className="text-gray-500 md:text-sm xl:text-md xl:text-lg py-4 w-2xl text-center">
            All the business growth and profit revolve around effective catchy
            marketing sales always in the limelight...
          </p>
        </div>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-5 sm:gap-10 xl:gap-0 xl:grid-cols-5">
            {instagram.map((item, index) => {
              return (
                <div className="relative sm:w-full  h-[288px]">
                  <Image
                    src={item.image}
                    alt="auth image"
                    fill
                    className="object-cover"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Instagram;
