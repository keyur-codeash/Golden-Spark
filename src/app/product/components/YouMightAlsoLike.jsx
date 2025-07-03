import Heading from "@/components/Heading";
import ShoppingCard from "@/components/ShoppingCard";
import { YouMightAlsoLikeData } from "@/data/data";
import React from "react";

function YouMightAlsoLike() {
  return (
    <div className="instagram relative">
      <div className="container mx-auto">
        <div className="pb-10">
          <Heading>You Might Also Like</Heading>
        </div>
        <div>
          {/* Product Grid */}
          <div className="flex-1 px-4">
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10">
              {YouMightAlsoLikeData.map((item, index) => (
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
      </div>
    </div>
  );
}

export default YouMightAlsoLike;
