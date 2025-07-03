import React from "react";
import Heading from "../Heading";
import { shortBy } from "@/data/data";
import ShoppingCard from "../ShoppingCard";

function BrowseLatestArrivals() {
  return (
    <>
      <div className="shopByCollection pt-20">
        <div className="container mx-auto">
          <Heading className="text-brown-900" color="text-brown-900">
            Browse Latest Arrivals
          </Heading>

          <div className="flex justify-center pb-7">
            <p className="text-gray-500 md:text-sm xl:text-md xl:text-lg py-4 w-2xl text-center">
              Our fashion jewellery is inspired by minimalism, focused on
              minimal simplicity, perfect for everyday wear and cherished for
              years.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 gap-y-10 gap-x-0 lg:gap-x-0  ">
              {shortBy.map((item, index) => (
                <ShoppingCard
                  key={index}
                  image={item.image}
                  text={item.text}
                  price={item.price}
                  isLink={true}
                  //   className="bg-brown-500 "
                  //   imageheight="h-[12rem] xl:h-[350px]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BrowseLatestArrivals;
