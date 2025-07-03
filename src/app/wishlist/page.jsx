"use client";
import HeroSectionCommon from "@/components/HeroSectionCommon";
import ShoppingCard from "@/components/ShoppingCard";
import { wishListData } from "@/data/data";
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

function page() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  return (
    <div data-aos="fade-up">
      <div className="your-cart">
        <HeroSectionCommon heading="Home/Wishlist" />
        <div className="container mx-auto">
          <div className="pt-10 md:pt-20">
            {/* Product Grid */}
            <div className="pb-10 flex-1 px-4">
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-y-10">
                {wishListData.map((item, index) => (
                  <ShoppingCard
                    key={index}
                    image={item.image}
                    text={item.text}
                    price={item.price}
                    heartbg={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
