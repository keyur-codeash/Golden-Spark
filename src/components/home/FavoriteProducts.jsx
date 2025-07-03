import React from "react";
import Heading from "../Heading";
import { favoriteProducts, shortBy } from "@/data/data";
import CardCommon from "../CardCommon";
import ShoppingCard from "../ShoppingCard";
import Image from "next/image";

function FavoriteProducts() {
  return (
    <>
      <div className="shopByCollection sm:pt-10 relative">
        <div className="container mx-auto">
          <Heading className="text-brown-900 !px-1" color="text-brown-900">
            Your Favorite Products
          </Heading>

          <div className="flex justify-center pb-7">
            <p className="text-gray-500 md:text-sm xl:text-md xl:text-lg py-4 w-2xl text-center">
              Our fashion jewellery is inspired by minimalism, focused on
              minimal simplicity, perfect for everyday wear and cherished for
              years.
            </p>
          </div>
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  2xl:grid-cols-5 gap-y-10 gap-x-0 lg:gap-x-0  ">
              {favoriteProducts.map((item, index) => (
                <ShoppingCard
                  key={index}
                  image={item.image}
                  text={item.text}
                  price={item.price}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="absolute hidden md:block top-0 xl:top-10 w-[70px] md:w-[103px] h-[113px]">
          <Image
            src="/images/side-icon-down.png"
            alt="auth image"
            width={103}
            height={113}
            className="object-cover"
          />
        </div>
      </div>
    </>
  );
}

export default FavoriteProducts;
